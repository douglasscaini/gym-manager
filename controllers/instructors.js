const fs = require('fs')
const data = require('../data.json')
const { age, date } = require('../utils')
const intl = require('intl')

// INDEX
exports.index = function (req, res) {
    return res.render('instructors/index', { instructors: data.instructors })
}

// CREATE
exports.create = function (req, res) {
    res.render('instructors/create')
}

// POST
exports.post = function (req, res) {
    const keys = Object.keys(req.body)

    for (key of keys) {
        if (req.body[key] == "") {
            return res.send('Please, fill all fields!')
        }
    }

    let { avatar_url, name, birth, gender, services } = req.body

    id = Number(data.instructors.length + 1)
    birth = Date.parse(req.body.birth)
    created_at = Date.now()

    data.instructors.push({
        id,
        avatar_url,
        name,
        birth,
        gender,
        services,
        created_at
    })

    fs.writeFile('data.json', JSON.stringify(data, null, 4), function (err) {
        if (err) return res.send('Write POST error!')

        return res.redirect(`/instructors`)
    })
}

// SHOW
exports.show = function (req, res) {
    const { id } = req.params

    const foundInstructor = data.instructors.find((instructor) => {
        return instructor.id == id
    })

    if (!foundInstructor) return res.send('Instrutor not found!')

    const instructor = {
        ...foundInstructor,
        age: age(foundInstructor.birth),
        services: foundInstructor.services.split(","),
        created_at: new intl.DateTimeFormat('pt-BR').format(foundInstructor.created_at)
    }

    res.render('./instructors/show', { instructor })
}

// EDIT
exports.edit = function (req, res) {
    const { id } = req.params

    const foundInstructor = data.instructors.find((instructor) => {
        return instructor.id == id
    })

    if (!foundInstructor) return res.send('Instrutor not found!')

    const instructor = {
        ...foundInstructor,
        birth: date(foundInstructor.birth).iso
    }

    return res.render('instructors/edit', { instructor })
}

// PUT
exports.put = function (req, res) {
    const { id } = req.body
    let index = 0

    const foundInstructor = data.instructors.find((instructor, foundIndex) => {
        if (id == instructor.id) {
            index = foundIndex
            return true
        }
    })

    if (!foundInstructor) return res.send('Instrutor not found!')

    const instructor = {
        ...foundInstructor,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    data.instructors[index] = instructor

    fs.writeFile('data.json', JSON.stringify(data, null, 4), function (err) {
        if (err) return res.send('Write PUT error!')

        return res.redirect(`/instructors/${id}`)
    })
}

// DELETE
exports.delete = function (req, res) {
    const { id } = req.body

    const filteredInstructors = data.instructors.filter(function (instructor) {
        return instructor.id != id
    })

    data.instructors = filteredInstructors

    fs.writeFile('data.json', JSON.stringify(data, null, 4), function (err) {
        if (err) return res.send('Write file err...')

        return res.redirect('/instructors')
    })
}