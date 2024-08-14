'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material'
import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'
import Input from '@mui/joy/Input'
import axios from 'axios'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [itemSubmitName, setItemSubmitName] = useState('')
  const [generateText, setGenerateText] = useState('')
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handleSuggest = async () => {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "meta-llama/llama-3.1-8b-instruct:free",
          "messages": [
            { "role": "user", "content": "What is destiny?" },
          ],
        })
      });
      const data = await res.json();
      setGenerateText(data.choices[0]?.message.content);
      setItemSubmitName('');
      console.log("hello");
    }
    catch (error) {
      setGenerateText("An error occurred: " + error);
      console.log('kk');
      setItemSubmitName('');
    }
  };


  return (
    <>
      <Box
        width="100vw"
        height="70vh"
        display={'flex'}
        justifyContent={'center'}
        flexDirection={'column'}
        alignItems={'center'}
        gap={2}
      >
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add Item
            </Typography>
            <Stack width="100%" direction={'row'} spacing={2}>
              <TextField
                id="outlined-basic"
                label="Item"
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <Button
                variant="outlined"
                onClick={() => {
                  addItem(itemName)
                  setItemName('')
                  handleClose()
                }}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>
        <Button
          variant="contained"
          onClick={handleOpen}
          sx={{
            background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)', // Gradient background
            borderRadius: '8px', // Slightly rounded corners
            boxShadow: '0px 3px 5px 2px rgba(255, 105, 135, .3)', // Subtle shadow for depth
            color: 'white',
            padding: '10px 20px', // Increase padding for a larger button
            fontSize: '16px',
            fontWeight: 'bold',
            textTransform: 'none', // Keep text as is without uppercasing
            transition: 'transform 0.2s ease, box-shadow 0.2s ease', // Smooth transitions
            '&:hover': {
              transform: 'scale(1.05)', // Slight zoom effect on hover
              boxShadow: '0px 6px 10px 4px rgba(255, 105, 135, .3)', // Enhanced shadow on hover
            },
            '&:active': {
              transform: 'scale(0.98)', // Slight shrink on click for tactile feedback
            },
          }}
        >
          Add New Item
        </Button>
        <Box border={'1px solid #333'}>
          <Box
            width="800px"
            height="100px"
            bgcolor={'#ADD8E6'}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
              Inventory Items
            </Typography>
          </Box>
          <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
            {inventory.map(({ name, quantity }) => (
              <Box
                key={name}
                width="100%"
                minHeight="150px"
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
                bgcolor={'#f0f0f0'}
                paddingX={5}
              >
                <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                  Quantity: {quantity}
                </Typography>
                <Button variant="contained" onClick={() => removeItem(name)}>
                  Remove
                </Button>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
      <Box
        width={1}
        height={1}
        my={4}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={4}
        p={2}
        sx={{
          position: 'relative', // Required for absolute positioning of stars
          border: '2px solid grey',
          borderRadius: '12px',
          background: '#1a1a2e',
          color: 'white',
          overflow: 'hidden',
          '&:before, &:after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 2%, rgba(255,255,255,0) 70%)',
            animation: 'moveStars 20s linear infinite',
            transform: 'translate(-50%, -50%) scale(0.5)',
          },
          '&:after': {
            animationDuration: '30s',
            animationDirection: 'reverse',
          },
        }}
      >
        <div style={{ zIndex: 1 }}>
          Input your stuff here to generate components to make.
          <Input
            placeholder="Type in here…"
            onChange={(e) => setItemSubmitName(e.target.value)}
            sx={{ mt: 2, backgroundColor: 'white', color: 'black', borderRadius: '4px' }}
          />
          <Button
            onClick={handleSuggest}
            variant="contained"
            sx={{ mt: 2, backgroundColor: '#3a86ff', color: 'white' }}
          >
            Submit
          </Button>
        </div>
      </Box>

      <style jsx global>{`
  @keyframes moveStars {
    0% {
      transform: translate(-50%, -50%) scale(0.5) rotate(0deg);
    }
    100% {
      transform: translate(-50%, -50%) scale(0.5) rotate(360deg);
    }
  }
`}
      </style>
      <Box
        width={1}
        my={4}
        display="flex"
        justifyContent="center"
        alignItems="center"
        p={2}
        sx={{
          border: '2px solid grey',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #f9f9f9 0%, #e0e0e0 100%)', // Gradient background
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          maxWidth: '100%',
          transition: 'background 0.5s ease, transform 0.3s ease', // Smooth transition on hover
          '&:hover': {
            background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', // Magical color change on hover
            transform: 'scale(1.02)', // Slight zoom effect on hover
          },
        }}
      >
        <pre style={{
          fontFamily: 'Arial, sans-serif',
          fontSize: '16px',
          color: '#333',
          margin: 0,
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          overflow: 'auto',
          maxWidth: '100%',
          maxHeight: '400px',
        }}>
          {generateText}
        </pre>
      </Box>

    </>
  )
}