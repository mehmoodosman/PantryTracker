'use client';

import { useState, useEffect } from 'react';
import { Box, Stack, Typography, Button, Modal, TextField, responsiveFontSizes } from '@mui/material';
import { firestore } from '@/firebase';
import { collection, doc, getDocs, query, setDoc, deleteDoc, getDoc } from 'firebase/firestore';

// Modal style for adding new items
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

// Header style
const header = {
  width: '100%',
  height: '80px',
  backgroundColor: '#030303',
  borderBottom: '0.8px solid #e5e7eb',
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 20px',
  color: 'white',
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [recipes, setRecipes] = useState([]);

  // Fetch inventory data from Firestore
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  // Add item to Firestore
  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  // Remove item from Firestore
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Mock AI recipe generation logic
  const generateRecipes = () => {
    if (!inventory.length) return;

    const sampleRecipes = [
      {
        title: 'Mixed Vegetable Stir Fry',
        ingredients: ['Broccoli', 'Bell Peppers', 'Carrots', 'Soy Sauce'],
        instructions: 'Sauté vegetables in a pan with soy sauce until tender. Serve with rice or noodles.',
      },
      {
        title: 'Pasta Primavera',
        ingredients: ['Pasta', 'Tomatoes', 'Zucchini', 'Garlic', 'Parmesan'],
        instructions: 'Cook pasta. Sauté tomatoes and zucchini with garlic, mix with pasta, and sprinkle Parmesan.',
      },
      {
        title: 'Taco Salad',
        ingredients: ['Lettuce', 'Tortillas', 'Black Beans', 'Avocado', 'Cheese'],
        instructions: 'Mix lettuce with beans and chopped avocado. Crush tortillas on top and sprinkle cheese.',
      },
    ];

    // Filter recipes that can be made with available ingredients
    const availableRecipes = sampleRecipes.filter((recipe) =>
      recipe.ingredients.every((ingredient) =>
        inventory.some((item) => item.name.toLowerCase() === ingredient.toLowerCase())
      )
    );

    setRecipes(availableRecipes);
  };

  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" alignItems="center" bgcolor="#f8f9fa">
      {/* Header */}
      <Box sx={header}>
        <Typography variant="h6" component="div">
          PantryTracker
        </Typography>
      </Box>

      {/* Main Content */}
      <Box
        display="flex"
        flexDirection={{ xs: 'column', md: 'row' }}
        justifyContent="center"
        alignItems="flex-start"
        gap={4}
        padding="20px"
        boxSizing="border-box"
        color="#333"
        width="100%"
        maxWidth="1440px"
        marginTop="20px"
      >
        {/* Pantry Inventory List */}
        <Box flex="1" width={'100%'} bgcolor="white" borderRadius="8px" padding="16px" boxShadow="0 0 10px rgba(0,0,0,0.1)" position="relative">
          <Typography variant="h6" gutterBottom> Pantry Inventory
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpen}
              sx={{
                position: 'absolute',
                top: '10px',
                right: '16px',
                backgroundColor: '#6200EE',
                '&:hover': { backgroundColor: '#3700B3' },
              }}
            >
              Add Item
            </Button>
          </Typography>
          <Stack spacing={1} maxHeight="500px" overflow="auto" sx={{ marginBottom: '20px' }}>
            {inventory.map(({ name, quantity }) => (
              <Box
                key={name}
                width="100%"
                minHeight="3"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bgcolor="#f0f0f0"
                paddingX={1}
                paddingY={1}
                borderRadius="4px"
                sx={{
                  '&:hover': {
                    backgroundColor: '#e0e0e0',
                    transition: 'background-color 0.3s',
                  },
                }}
              >
                <Typography variant="body1" color="#333" flex={"1 1 0px"}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="body1" color="#333" flex={"1 1 0px"}>
                  Qty: {quantity}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button variant="outlined" color="info" onClick={() => addItem(name)}>
                    +
                  </Button>
                  <Button variant="outlined" color="error" onClick={() => removeItem(name)}>
                    -
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
          {/* Analyze Recipe Button */}
          <Button variant="contained" color="success" sx={{ width: '100%' }} onClick={generateRecipes}>
            Analyze Recipe
          </Button>
        </Box>

        {/* AI Recipe Suggestions */}
        <Box flex="1" bgcolor="white" borderRadius="8px" padding="16px" boxShadow="0 0 10px rgba(0,0,0,0.1)">
          <Typography variant="h6" gutterBottom>
            Recipe Suggestions
          </Typography>
          <Stack spacing={3}>
            {recipes.length === 0 ? (
              <Typography variant="body1" color="#666">
                No recipes available for your current pantry items. Please add more items or click 'Analyze Recipe' to refresh suggestions.
              </Typography>
            ) : (
              recipes.map((recipe, index) => (
                <Box key={index} border="1px solid #ddd" borderRadius="4px" padding="8px">
                  <Typography variant="subtitle1" fontWeight="bold">
                    {recipe.title}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Ingredients:</strong> {recipe.ingredients.join(', ')}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Instructions:</strong> {recipe.instructions}
                  </Typography>
                </Box>
              ))
            )}
          </Stack>
        </Box>
      </Box>
      {/* Add Item Modal */}
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction="row" spacing={2}>
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
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
}

