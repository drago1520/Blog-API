import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

await mongoose.connect('mongodb://127.0.0.1:27017/blogDB');
const app = express();
const port = 4000;
//get the array of document in MongoDB
async function get_db (){
  let find_results = await Page.find({});
  return find_results
}

// In-memory data store
let postss = [
  {
    id: 1,
    title: "The Rise of Decentralized Finance",
    content:
      "Decentralized Finance (DeFi) is an emerging and rapidly evolving field in the blockchain industry. It refers to the shift from traditional, centralized financial systems to peer-to-peer finance enabled by decentralized technologies built on Ethereum and other blockchains. With the promise of reduced dependency on the traditional banking sector, DeFi platforms offer a wide range of services, from lending and borrowing to insurance and trading.",
    author: "Alex Thompson",
    date: "2023-08-01T10:00:00Z",
  },
  {
    id: 2,
    title: "The Impact of Artificial Intelligence on Modern Businesses",
    content:
      "Artificial Intelligence (AI) is no longer a concept of the future. It's very much a part of our present, reshaping industries and enhancing the capabilities of existing systems. From automating routine tasks to offering intelligent insights, AI is proving to be a boon for businesses. With advancements in machine learning and deep learning, businesses can now address previously insurmountable problems and tap into new opportunities.",
    author: "Mia Williams",
    date: "2023-08-05T14:30:00Z",
  },
  {
    id: 3,
    title: "Sustainable Living: Tips for an Eco-Friendly Lifestyle",
    content:
      "Sustainability is more than just a buzzword; it's a way of life. As the effects of climate change become more pronounced, there's a growing realization about the need to live sustainably. From reducing waste and conserving energy to supporting eco-friendly products, there are numerous ways we can make our daily lives more environmentally friendly. This post will explore practical tips and habits that can make a significant difference.",
    author: "Samuel Green",
    date: "2023-08-10T09:15:00Z",
  },
];
const pageSchema = new mongoose.Schema({
  id: Number,
  title: String,
  content: String,
  author: String,
  date: Date
});
  const Page = mongoose.model("Page", pageSchema);
  let article = [];
  (async function test_empty_db (){
    let db = await get_db();
    let length = db.length;
    if (length === 0){
      for (let i=0; i<postss.length; i++){
        article[i] = new Page(postss[i]);
      }
    let insert_results = await Page.insertMany(article);
    console.log("Pages Successfully added!");
    
  }else{
    console.log("Docs not empty. Nothin added.");
  }
})()

  


// let article1 = new Page(posts[0]);
// let article2 = new Page(posts[1]);
// let article3 = new Page(posts[2]);


// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Write your code here//

//CHALLENGE 1: GET All posts
app.get("/posts", async (req, res)=>{
  //gets Posts from DB
  let posts = await get_db();
  res.json(posts);
  //post && article = 1:1
})
//CHALLENGE 2: GET a specific post by id
app.get("/posts/:id", async(req, res)=>{
  let id = req.params.id;
  let posts = await get_db();
  //finds the index in the array of the Requested post.
  const found = await Page.findOne({id : id}).exec();
  res.json(found);
})
//CHALLENGE 3: POST a new post
app.post("/posts", async(req, res)=>{
  let posts = await get_db();
  req.body.id = posts.length + 1;
  //# add new document at the back
  //postss.push(req.body);
  //res.json(posts); - # send them back
  let new_doc = new Page (req.body);
  let insert_results = await new_doc.save();
  posts = await get_db();
  res.json(posts);
})
//CHALLENGE 4: PATCH a post when you just want to update one parameter
app.patch("/posts/:id", async(req,res)=>{
  let id = req.params.id;
  let update_results = await Page.findOneAndUpdate({id: id}, {
    title: req.body.title || title,
    author: req.body.author || author,
    content: req.body.content || content
  }, {new: true});
  
  let posts = get_db();
  res.json(posts);
})
//CHALLENGE 5: DELETE a specific post by providing the post id.
app.delete("/posts/:id", async (req, res)=>{
  let id = req.params.id;
  let delete_response = await Page.findOneAndDelete({id: id});
  console.log(delete_response);
  let posts = get_db();

  res.json(posts);
})
app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
  
});










