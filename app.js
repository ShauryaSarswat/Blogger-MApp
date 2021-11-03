var express     = require("express"),
methodOverride  = require("method-override"),
bodyParser      = require("body-parser"),
expressSanitizer = require("express-sanitizer"),
mongoose        = require("mongoose"),
app             = express();
mongoose.connect('mongodb://localhost:27017/restful_blog_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
app.set("view engine", "ejs"); //connecting ejs
app.use(express.static("public")); //using express
app.use(bodyParser.urlencoded({extended: true})); //using body-parser
app.use(methodOverride("_method"));//using method-override + what to look for in url *the parentheses as above*
//Routes
app.use(expressSanitizer());
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: 
        {type: Date, default: Date.now} //i.e it should be a date and to check for default date value as of now
});
var Blog = mongoose.model("Blog", blogSchema);
// INDEX
app.get("/",function(req, res){
	res.render("landing");
});
app.get("/blogs", function (req, res){
    Blog.find({}, function (err, blogs){ // adding index functionality to retrieve all blogs from database
        if (err) {
            console.log(err);
        } else {
            res.render("index", {blogs: blogs}); //blogs:blogs -> render index with data (blogs is the data)
        }
    });
});

//CREATE ROUTE
app.post("/blogs/new", function(req, res){
   //create blog
   console.log(req.body.blog.body);
   req.body.blog.body = req.sanitize(req.body.blog.body);
   console.log(req.body.blog.body);
   Blog.create(req.body.blog, function (err, newBlog){
       if(err) {
           res.render("new");
       } else {
           //if successful, redirect to index
           res.redirect("/blogs");
       }
   });
});
app.get("/blogs/new", function(req, res){
    res.render("new");// all we have to do is render b/c its new
});
app.get("/blogs/:id", function(req, res){
   Blog.findById(req.params.id, function(err, foundBlog){
       if (err) {
           res.redirect("/blogs");
       } else {
           res.render("show", {blog: foundBlog});
       }
   })
});

app.delete("/blogs/:id", function(req, res){
   //destroy blog
   Blog.findByIdAndRemove(req.params.id, function(err){
       if (err) {
           res.redirect("/blogs");
       } else {
           res.redirect("/blogs");
       }
   });
   //redirect somewhere
});
app.listen(3000, function(){
	console.log("server is running");
})
