const { date } = require('../../lib/utils')
const Member = require('../models/Member')

module.exports = {
    index(req, res) {

        let { filter, page, limit } = req.query

        page = page || 1
        limit = limit || 2
        let offset = limit * (page - 1)

        const params = {
            filter,
            page,
            limit,
            offset,
            callback(members) {

                const pagination = {
                    total: members[0] ? Math.ceil(members[0].total / limit) : 0,
                    page
                }
                return res.render('members/index', { members, pagination, filter })
            }
        }

        Member.paginate(params)

    },
    create(req, res) {

        Member.instructorsSelectOptions((instructorOptions) => {
            res.render('members/create', { instructorOptions })
        })

    },
    post(req, res) {

        const keys = Object.keys(req.body)
        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Por favor, preencha todos os campos!')
            }
        }

        Member.create(req.body, (member) => {
            return res.redirect(`/members/${member.id}`)
        })

    },
    show(req, res) {

        Member.find(req.params.id, (member) => {
            if (!member) return res.send('Membro não encontrado!')

            member.birth = date(member.birth).birthDay

            return res.render('members/show', { member })
        })

    },
    edit(req, res) {

        Member.find(req.params.id, (member) => {
            if (!member) return res.send('Membro não encontrado!')

            member.birth = date(member.birth).iso

            Member.instructorsSelectOptions((instructorOptions) => {
                res.render('members/edit', { member, instructorOptions })
            })
        })

    },
    put(req, res) {

        const keys = Object.keys(req.body)
        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Por favor, preencha todos os campos!')
            }
        }

        Member.update(req.body, () => {
            return res.redirect(`/members/${req.body.id}`)
        })

    },
    delete(req, res) {

        Member.delete(req.body.id, () => {
            return res.redirect(`/members`)
        })
    }
}