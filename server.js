const PORT = process.env.PORT || 3000;
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

//get route
app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, "db", "db.json"), 'utf-8', function(err, data) {
        if (err) {
            res.status(500).json(err)
            return
        }
        const json = JSON.parse(data)
        res.json(json)
    })
});
//view routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// post route
app.post('/api/notes', (req, res) => {
    const {title, text} = req.body

    if (!title || !text) {
        res.status(400).json({error: 'Missing title or text.'})
      return
    }
    const newNote = {
        id: Math.random(),
        ...req.body
    }
    fs.readFile(path.join(__dirname, "db", "db.json"), 'utf-8', function(err, data) {
        if (err) {
            res.status(500).json(err)
            return
        }
        const notes = JSON.parse(data)
        notes.push(newNote)
        
        fs.writeFile(path.join(__dirname, "db", "db.json"), JSON.stringify(notes), function(err) {
            if (err) {
                res.status(500).json(err)
                return
            }
            res.status(200).json(newNote)
        })
    })
});


app.delete('/api/notes/:id', (req, res) => {

    if(!id) {
     res.status(400).json({ error: "We need an id"})
     return
   }
 
   fs.readFile(path.join(__dirname, "db", "db.json"), "utf-8", function(err, data) {
    if (err) {
        res.status(500).json(err)
        return
    }
     const notes = JSON.parse(data)
     const id = req.params.id
     const updatedNotes = notes.filter(note => id != note.id)
 
     fs.writeFile(path.join(__dirname, "db", "db.json"), JSON.stringify(updatedNotes), function(err) {
         if (err) {
             res.status(500).json(err)
             return
         }
         res.json(updatedNotes)
     })
   })
});

app.listen(PORT, () => {
    console.log(`API server now on port http://localhost:${PORT} !`);
});