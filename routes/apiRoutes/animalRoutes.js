const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');
const { animals } = require('../../data/animals');
const router = require('express').Router()
router.get('/animals', (req,res) => {
    let results = animals
    if (req.query) {
      results = filterByQuery(req.query,results)
    }
    res.json(results);
});
router.get('/animals/:id', (req,res) => {
  const result = findById(req.params.id,animals);
  (result) ? res.json(result) : res.sendStatus(404);
});
router.post('/animals', (req,res) =>  {
  req.body.id = animals.length.toString()
  if (!validateAnimal(req.body)) {
    res.status(400).send("The animal was not properly formatted")
  }
  else {
    const animal = createNewAnimal(req.body,animals)
    res.json(animal)
}
});

module.exports = router