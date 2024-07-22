import { Router, Request, Response } from "express";
import { Item } from "../models/todo";
import multer from "multer";
import path from "path";
import { error } from "console";

const router = Router();

// Multer Config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// Create Item
router.post(
  "/todos/add-new-todo",
  upload.single("file"),
  async (req: Request, res: Response) => {
    try {
      const { task, description,completed } = req.body;
      const newItem = new Item({
        task,
        description,
        completed,
        filename: req.file?.filename,
      });
      await newItem.save();
      res.status(201).json({message: "Data Berhasil Ditambah" });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
);

//Get ALL ITEM
router.get("/todos", async(req: Request, res: Response)=>{
  try{
    const items = await Item.find();
    res.status(200).json(items);
  }catch (error){
  res.status(400).json({error: (error as Error).message});
  }
});

//GET ALL ITEM WITH FILTERING
router.post("/todos/list", async (req: Request, res: Response) =>{
  try{
    const { task, description, completed} = req.body;
    const filter : any = {};

    if(completed) {;
      filter.task = task;
    };

    const items = await Item.find(filter);
    res.status(200).json(items);
  } catch (error) {
    res.status(400).json({ error: (error as Error). message});
  }
});

//update data
router.post("/todos/update-todo/:id", async (req: Request, res:Response) =>{
  try{
    const { task, description, completed } = req.body;
    const UpdatedData: any = { task, description, completed };

    const UpdatedToDo = await Item.findByIdAndUpdate(
      req.params.id,
      UpdatedData,
    { new: true, overwrite: true }    
  );
  if(!UpdatedToDo){
    return res.status(404).json({ message: "Item not Found"});
  }
  res.status(200).json({message: "Data Berhasil Diupdate"});
  } catch( error ){
    res.status(400).json({ error: (error as Error). message});
  }
});

//delete data


router.delete('/todos/delete-todo/:id', async (req: Request, res: Response) => {
    try {
      const item = await Item.findByIdAndDelete(req.params.id);
      if (!item) {
        return res.status(404).json({ message: 'Task ToDo not Found' });
      }
      res.status(200).json({ message: "Data Berhasil Dihapus"});
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });
export default router;
