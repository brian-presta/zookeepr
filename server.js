const express = require('express')
const fs = require('fs');
const path = require('path');
const {animals} = require('./data/animals.json')
const PORT = process.env.PORT || 3001;
const app = express()
app.use(express.urlencoded({extended: true}))
app.use(express.json())
function filterByQuery(query, animalsArray) {
  let filteredResults = animalsArray;
  if (query.diet) {
    filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
  }
  if (query.species) {
    filteredResults = filteredResults.filter(animal => animal.species === query.species);
  }
  if (query.name) {
    filteredResults = filteredResults.filter(animal => animal.name === query.name);
  }
  if (query.personalityTraits) {
      if (typeof query.personalityTraits === 'string') {
          query.personalityTraits = [query.personalityTraits]
      }
      filteredResults = filteredResults
      .filter(animal => query.personalityTraits.every(trait => animal.personalityTraits.includes(trait)))
  }
  return filteredResults;
}
function findById(id,animalsArray) {
  for (animal of animalsArray) {
    if (animal.id === id) {
      return animal
    }
  }
  return null
}
function createNewAnimal(body,animalsArray) {
  const animal = body
  animalsArray.push(animal)
  fs.writeFileSync(
    path.join(__dirname,'./data/animals.json'),
    JSON.stringify({animals: animalsArray}, null, 2)
  )
  return animal
}
function validateAnimal(animal) {
  if (!animal.name || typeof animal.name !== 'string') {
    return false;
  }
  if (!animal.species || typeof animal.species !== 'string') {
    return false;
  }
  if (!animal.diet || typeof animal.diet !== 'string') {
    return false;
  }
  if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
    return false;
  }
  return true;
}
app.get('/api/animals', (req,res) => {
    let results = animals
    if (req.query) {
      results = filterByQuery(req.query,results)
    }
    res.json(results);
});
app.get('/api/animals/:id', (req,res) => {
  const result = findById(req.params.id,animals);
  (result) ? res.json(result) : res.sendStatus(404);
});
app.post('/api/animals', (req,res) =>  {
  req.body.id = animals.length.toString()
  if (!validateAnimal(req.body)) {
    res.status(400).send("The animal was not properly formatted")
  }
  else {
    const animal = createNewAnimal(req.body,animals)
    res.json(animal)
}
});
app.listen(PORT,function(){
    console.log('API server now on port 3001!')
});