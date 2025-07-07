const express = require('express');
const app = express();
app.use(express.json())
const PORT = 3000;

const todoList = [
    {
        id:1,
        description:"Do Laundry",
        status:"Pending"
    },
    {
        id:2,
        description:"Pick up the dry cleaning",
        status:"Pending"
    },
    {
        id:3,
        description:"Deploy Project",
        status:"Complete"
    },
    {
        id:23,
        description:"host people",
        status:"Complete"
    },
    {
        id:17,
        description:"bring food",
        status:"pending"
    },

]


function swap(i,j){
    const temp = todoList[i];
    todoList[i] = todoList[j];
    todoList[j] = temp;
}

app.get('/',(req,res)=>{
    res.status(201).json({
        message:"Server Running"
    })
})

app.get('/api/getItems',(req,res)=>{
    try{
        return res.status(201).json({
            message:'Data Retrieved Successfully',
            data: todoList
        })
    }
    catch(err){
        res.status(500).json({
            message:"Error In Retrieving Data",
        })
    }
})

app.post('/api/updateList',(req,res)=>{
    try{
        const {id,description,status} = req.body;

        const index = todoList.findIndex(item=>item.id == id);

        if(!id || !description || !status || index!=-1){
            return res.status(400).json({
                message:"Invalid data sent"
            })
        }

        const newItem = {
            id:id,
            description:description,
            status:status
        }

        todoList.push(newItem)
        res.status(201).json({
            message:"Data Added",
            items:todoList
        })

    }
    catch(err){
        res.status(500).json({
            message:"Error in Adding item to the list"
        })
    }
})

app.put('/api/updateList',(req,res)=>{
    try{
        const {id} = req.query;
        const {description,status} = req.body;

        const index = todoList.findIndex(item=>item.id==id);

        if(!id || !description  || !status || index==-1){
            return res.status(400).json({
                message:"Invalid Data Sent"
            })
        }

        const updatedItem = {
            id: id,
            description:description,
            status:status
        }

        todoList[index] = updatedItem;

        res.status(201).json({
            message:"Item Updated",
            item:todoList[index]
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message:"Error in Updating Data",
        })
    }
})

app.patch('/api/updateList',(req,res)=>{
    try{
        const {id} = req.query;
        const {description,status} = req.body;

        const index = todoList.findIndex(item=>item.id==id);

        if(!id || (!description && !status) || index==-1){
            return res.status(400).json({
                message:"Invalid data sent"
            })
        }

        const currentItem = todoList[index];

        todoList[index] = {...currentItem, 
                            description:description ? description : currentItem.description,
                            status: status? status : currentItem.status}
       
        res.status(201).json({
            message:"Data Updated Successfully",
            item:todoList[index]
        })
    }
    catch(err){
        console.log(err)
        res.status(500).json({
            message:"Error Updating the data"
        })
    }
})

app.get('/api/getItemsSortedById',(req,res)=>{
    try{
        const {k} = req.query;
        if(!k){
            res.status(400).json({
                message:"Parameter required for sorting"
            })
        }
    if(k=='asc'){
       for(i=0;i<todoList.length;i++){
        for(j=0;j<todoList.length-1-i;j++){
            if(todoList[j].id > todoList[j+1].id){
                swap(j,j+1);
            }
        }
       }
       return res.status(201).json({
        message:"Items sorted by Id in ascending order",
        items: todoList
       })
    }
    else if(k=='desc'){
        for(i=0;i<todoList.length;i++){
        for(j=0;j<todoList.length-1-i;j++){
            if(todoList[j].id < todoList[j+1].id){
                swap(j,j+1);
            }
        }
       }
       return res.status(201).json({
        message:"Items sorted by Id in descending order",
        items: todoList
       });
    }
    else{

        return res.status(400).json({
        message:"Invalid parameter received",
       })
    }


    }
    catch(err){
        console.log(err)
        res.status(500).json({
            message:"Error fetching data"
        })
    }
    
})

app.get('/api/getItemsSortedByDescription',(req,res)=>{
    try{
        const {k} = req.query;
          if(!k){
            res.status(400).json({
                message:"Parameter required for sorting"
            })
        }
        if(k=='asc'){
            for(i=0;i<todoList.length;i++){
                for(j=0;j<todoList.length-1-i;j++){
                    if(todoList[j].description.localeCompare(todoList[j+1].description)==1){
                        swap(j,j+1);   
                    }
                }
            }
            return res.status(201).json({
                message:"Data sorted by description in ascending order successfully",
                items:todoList
            })
        }
        else if(k=='desc'){
            for(i=0;i<todoList.length;i++){
                for(j=0;j<todoList.length-1-i;j++){
                    if(todoList[j].description.localeCompare(todoList[j+1].description)==-1){
                        swap(j,j+1);   
                    }
                }
            }
            return res.status(201).json({
                message:"Data sorted by description in descending order successfully",
                items:todoList
            })
        }
        else{
           return res.status(400).json({
            message:"Invalid parametere received"
           })
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message:"Error in fetching data"
        })
    }
})

app.get('/api/search',(req,res)=>{
    try{
        const {search} = req.query;

        if(!search){
            res.status(400).json({
                message:"Search field is missing"
            })
        }

        const found = todoList.filter(item=>item.description.toLowerCase().includes(search.toLowerCase()));
        if(found.length>0){
             res.status(201).json({
            message:"Data fetched",
            items:found
        })
        }
        else{
             res.status(201).json({
            message:"No match found",
        })
        }
       
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message:"Error in data searching"
        })
    }
})

app.listen(PORT,()=>{
    console.log('Server is running on PORT 3000');
})