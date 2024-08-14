'use server'

import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';

export default async function handler1(req, res) {
    try {
      const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${req.body.word}`);
      console.log(response.data);
      res.status(200).json(response.data);
    } 
    catch (error) {
      return res.status(500).json({ error: 'Error fetching data from Llama 3.1' });
    }
  }