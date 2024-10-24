import {useState} from "react";
import useImageUploader from "../../hooks/useImageUploader";
import axios from "axios";

function ShopAdd() {

    const [addItem,setAddItem] = useState({
        title:"",
        price:"",
        desc:"",
        file:"",
        stock:"",
        categoryId:""
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddItem({...addItem, [name]: value});
    }// 상품들 value값 수정 및 useState 변경

    const handleSubmit = async (e) => {
        e.preventDefault();
        const addItemFormData = new FormData();
        addItemFormData.append("title",addItem.title);
        addItemFormData.append("price",addItem.price);
        addItemFormData.append("desc",addItem.desc);
        addItemFormData.append("file",addItem.imgurl);
        addItemFormData.append("stock",addItem.stock);
        addItemFormData.append("categoryId",addItem.categoryId);

        if(images.length > 0) {
            images.forEach((i)=>{
                addItemFormData.append("file",images[i].file);

            })
        }

        try{
            const response = await axios.post("http://localhost:8090/shop/add", addItemFormData,{
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })

        }catch(err){
            console.log(err);
        }
    }

    const {images,handleImageChange,handleRemoveImage} = useImageUploader(true)

    console.log(images)

    return(
        <div>
            <h1>
                상품 추가 페이지
            </h1>

            <form>
                <input onChange={handleChange} type={"text"} placeholder={"상품명"} name={"title"} value={addItem.title}/>
                <input onChange={handleChange} type={"text"} placeholder={"가격"} name={"price"} value={addItem.price}/>
                <input onChange={handleChange} type={"text"} placeholder={"상품소개"} name={"desc"} value={addItem.desc}/>
                <input type="file" name={"file"} multiple accept="image/*" onChange={handleImageChange}/>
                <input onChange={handleChange} type={"text"} placeholder={"수량"} name={"stock"} value={addItem.stock}/>
                <input onChange={handleChange} type={"text"} placeholder={"카테고리"} name={"categoryId"}
                       value={addItem.categoryId}/>

                <div style={{display: 'flex', overflowX: 'auto'}}>
                    {images.map((image, index) => (
                        <div key={index} style={{position: 'relative', margin: '5px'}}>
                            <img src={image.preview} alt={`preview ${index}`} style={{width: '100px', height: '100px'}}/>
                            <button
                                type={"button"}
                                onClick={() => handleRemoveImage(index)}
                                style={{
                                    position: 'absolute',
                                    top: '5px',
                                    right: '5px',
                                    background: 'red',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                }}
                            >
                                X
                            </button>
                        </div>
                    ))}
                </div>

            </form>


        </div>
    )
}

export default ShopAdd;