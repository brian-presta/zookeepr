const express = require('express')
const {animals} = require('./data/animals.json')
const PORT = process.env.PORT || 3001;
const app = express()

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
app.listen(PORT,function(){
    console.log('API server now on port 3001!')
})