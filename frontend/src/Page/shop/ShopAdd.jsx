import {useState} from "react";
import axios from "axios";

function ShopAdd() {

    const [addItem, setAddItem] = useState({
        title:"",
        price:"",
        desc:"",
        imgurl:"",
        stock:"",
        categoryId:""
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response  = await axios.post("http://localhost:8090/shop/add", addItem);
            console.log(response,"업로드성공")
        }catch (error) {
            console.log(error);
        }


    }
    const handleChange = (e) =>{
        const {name, value} = e.target;
        setAddItem({...addItem, [name]: value});
    }
    console.log(addItem)
    return(
        <div>
            <h1>상품 추가 페이지</h1>

            <form onSubmit={handleSubmit} action={"/shop/add"} method={"POST"}>
                <input onChange={handleChange} value={addItem.title} type={"text"} name={"title"} placeholder={"상품명"}/>
                <input onChange={handleChange} value={addItem.price} type={"text"} name={"price"} placeholder={"가격"}/>
                <textarea onChange={handleChange} value={addItem.desc} placeholder={"본문"} name={"desc"}/>
                <input onChange={handleChange} value={addItem.imgurl} type={"text"} name={"imgurl"} placeholder={"imgurl"}/>
                <input onChange={handleChange} value={addItem.stock} type={"text"} name={"stock"} placeholder={"stock"}/>
                <input onChange={handleChange} value={addItem.categoryId} type={"text"} name={"categoryId"} placeholder={"categoryId"}/>
                <input type={"submit"}/>
            </form>

        </div>
    )
}
export default ShopAdd