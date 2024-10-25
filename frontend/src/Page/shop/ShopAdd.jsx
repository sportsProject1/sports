import {useState} from "react";
import useImageUploader from "../../hooks/useImageUploader";
import axios from "axios";
import {postData} from "../../Server/ApiService";
import {useNavigate} from "react-router-dom";
import {handleChange} from "../../Utils/handleChange";

function ShopAdd() {

    const [addItem,setAddItem] = useState({
        title:"",
        price:"",
        desc:"",
        file:"",
        stock:"",
        categoryId:""
    })

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const addItemFormData = new FormData();
        addItemFormData.append("title",addItem.title);
        addItemFormData.append("price",addItem.price);
        addItemFormData.append("desc",addItem.desc);
        addItemFormData.append("stock",addItem.stock);
        addItemFormData.append("categoryId",addItem.categoryId);

        if(images.length > 0) {
            images.forEach((image)=>{
                addItemFormData.append("file",image.file);
            })

        }

        postData("shop/add", addItemFormData)
            .then(res=> navigate("/shop"))
            .catch()

    }

    const {images,handleImageChange,handleRemoveImage} = useImageUploader(true)

    return(
        <div>
            <h1>
                상품 추가 페이지
            </h1>

            <form onSubmit={handleSubmit} action={"/shop/add"} method={"POST"} encType={"multipart/form-data"}>
                <input
                    onChange={(e)=>handleChange(e,addItem,setAddItem)}
                    type={"text"} placeholder={"상품명"} name={"title"} value={addItem.title}/>
                <input
                    onChange={(e)=>handleChange(e,addItem,setAddItem)}
                    type={"text"} placeholder={"가격"} name={"price"} value={addItem.price}/>
                <input
                    onChange={(e)=>handleChange(e,addItem,setAddItem)}
                    type={"text"} placeholder={"상품소개"} name={"desc"} value={addItem.desc}/>
                <input type="file" name={"file"} multiple onChange={handleImageChange}/>
                <input
                    onChange={(e)=>handleChange(e,addItem,setAddItem)}
                    type={"text"} placeholder={"수량"} name={"stock"} value={addItem.stock}/>
                <input
                    onChange={(e)=>handleChange(e,addItem,setAddItem)}
                    type={"text"} placeholder={"카테고리"} name={"categoryId"}
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

                <input type={"submit"} value={"상품 등록"}/>

            </form>


        </div>
    )
}

export default ShopAdd;