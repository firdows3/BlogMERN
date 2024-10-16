const express = require('express');
const cors = require('cors')
const {PrismaClient, Prisma } = require('@prisma/client')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}))
app.use(express.json())

const prisma = new PrismaClient();
const JWT_SECRET = 'dowsamir'

app.post('/Signup', async(req, res) => {
    const {email, username, password} = req.body;

    try {
        const hasshedPassword = await bcrypt.hash(password, 10)
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hasshedPassword
            }
        })
        res.status(201).json(newUser)      
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'user creation failed'})
    }
})

app.post('/Login', async(req, res) => {
    const {email, password} = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: {email: email}
        })
        if (!user) {
            return res.status(400).json('invalid credentials')
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            res.status(400).json('invalid credentials')
        }

        const token = jwt.sign({id: user.id, username: user.username}, JWT_SECRET, {expiresIn: '1h'})
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 3600000
        })
        res.json({token})
    } catch (error) {
        console.error(error);
        res.status(500).json({error})
    }
})

app.get('/blogPost', async(req, res)=>{
    
    const token = req.headers['authorization']?.split(' ')[1];
    let myBlogs = []

    try {
        const Blogs = await prisma.post.findMany()

        if (token) {
            const user = jwt.verify(token, JWT_SECRET);
            const username = user.username;
            
            myBlogs = Blogs.filter(blog => blog.username === username)
        }

        res.status(201).json({allBlogs: Blogs, myBlogs})
    } catch (error) {
        console.error(error)
        res.status(500).json(error)
    }
})

app.put('/editBlogPost/:id', async(req, res) => {
    const {id} = req.params;
    const {title, content} = req.body;

    const token = req.headers['authorization']?.split(' ')[1];
    console.log(req.headers);
    
    if (!token) {
        res.status(401).json('unauthorized')
    }

    try {
        const user = jwt.verify(token, JWT_SECRET);
        const username = user.username

        const post = await prisma.post.findUnique({
            where: {id: id}
        })

        if (!post) {
            res.status(404).json('post not found')
        }

        if (post.username !== username) {
            res.status(403).json('you have no permission for this')
        }

        const updatePost = await prisma.post.update({
            where: {id: id},
            data: {
                title,
                content
            }
        })

        res.status(201).json(updatePost)

    } catch (error) {
        res.status(500).json(error)
    }
})

app.delete('/blogPost/:id', async (req, res) => {
    const {id} = req.params;

    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        res.status(401).json('unauthorized')
    }

    try {
        const user = jwt.verify(token, JWT_SECRET);
        const username = user.username

        const post = await prisma.post.findUnique({
            where: {id: id}
        })

        if (!post) {
            res.status(404).json('post not found')
        }

        if (post.username !== username) {
            res.status(403).json('you have no permission for this')
        }

        await prisma.post.delete({
            where: {id: id}
        })

        res.status(204).send()

    } catch (error) {
        res.status(500).json(error)
    }

})

app.get('/blogPost/:id', async(req, res) => {
    const {id} = req.params
    try {
        const eachPost = await prisma.post.findUnique({
            where: {id: id}
        })
        if (!eachPost) {
            return res.status(404).json('post not found')
        }
        res.status(200).json(eachPost)
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
})

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user; 
        next();
    });
};

app.post('/blogPost', authenticateToken, async(req, res)=>{
    const {title, content} = req.body;
    const username = req.user.username
    
    try {
        const newBlog = await prisma.post.create({
            data: {
                title,
                content,
                username
            }
        })
        res.status(201).json(newBlog)
    } catch (error) {
        console.error(error)
        res.status(500).json(error)
    }
})

app.post('/comments', authenticateToken, async(req, res) => {
    const {comment} = req.body
    const username = req.user.username

    try {
        const newComment = await prisma.comment.create({
            data: {
                comment,
                username
            }
        })
        res.status(201).json(newComment)
    } catch (error) {
        console.error(error)
        res.status(500).json(error)
    }
})

app.listen('5173', ()=>{
    console.log('running...');
    
})

process.on('exit', async() => {
    await prisma.$disconnect()
})
