import {useState} from "react";
import useImageUploader from "../../hooks/useImageUploader";
import axios from "axios";
import {postData} from "../../Server/ApiService";
import {useNavigate} from "react-router-dom";
import {handleChange} from "../../Utils/handleChange";
import {Container} from "../../styled/Container";
import {Form} from "../../styled/Form";

function ShopAdd() {

    const [addItem,setAddItem] = useState({
        title:"",
        price:"",
        desc:"",
        file:"",
        stock:"",
        categoryId:"1"
    })

    const navigate = useNavigate();
    console.log(addItem)

    const handleSubmit = async (e) => {
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
            .then(res=> console.log(res))
            .catch()

    }

    const {images,handleImageChange,handleRemoveImage} = useImageUploader(true)

    return(
        <Container>
            <h1>
                상품 추가 페이지
            </h1>

            <Form onSubmit={handleSubmit} action={"/shop/add"} method={"POST"} encType={"multipart/form-data"}>
                <input
                    onChange={(e) => handleChange(e, addItem, setAddItem)}
                    type={"text"} placeholder={"상품명"} name={"title"} value={addItem.title}/>
                <input
                    onChange={(e) => handleChange(e, addItem, setAddItem)}
                    type={"text"} placeholder={"가격"} name={"price"} value={addItem.price}/>
                <input
                    onChange={(e) => handleChange(e, addItem, setAddItem)}
                    type={"text"} placeholder={"상품소개"} name={"desc"} value={addItem.desc}/>
                <input type={"file"} name={"file"} multiple onChange={handleImageChange}/>
                <input
                    onChange={(e) => handleChange(e, addItem, setAddItem)}
                    type={"text"} placeholder={"수량"} name={"stock"} value={addItem.stock}/>

{/*                <input
                    onChange={(e) => handleChange(e, addItem, setAddItem)}
                    type={"text"} placeholder={"수량"} name={"categoryId"} value={addItem.categoryId}/>*/}


                <select name={"categoryId"} onChange={(e) => handleChange(e, addItem, setAddItem)}>
                    <option value={"1"}>농구</option>
                    <option value={"2"}>축구</option>
                </select>

                <div style={{display: 'flex', overflowX: 'auto'}}>
                    {images.map((image, index) => (
                        <div key={index} style={{position: 'relative', margin: '5px'}}>
                            <img src={image.preview} alt={`preview ${index}`}
                                 style={{width: '100px', height: '100px'}}/>
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

            </Form>


        </Container>
    )
}

export default ShopAdd;