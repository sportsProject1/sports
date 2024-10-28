import {useState} from "react";
import useImageUploader from "../../hooks/useImageUploader";
import {useNavigate} from "react-router-dom";
import {handleChange} from "../../Utils/handleChange";
import {Container} from "../../styled/Container";
import {Form} from "../../styled/Form";
import {useSelector} from "react-redux";
import {postTokenData} from "../../Server/ApiService";

function ShopAdd() {

    const [addItem,setAddItem] = useState({
        title:"",
        price:"",
        desc:"",
        file:"",
        stock:"",
        categoryId:"1"
    })

    const userData = useSelector((state)=>state.auth.user) // 리덕스 툴킷에 저장한 유저정보 가져오기
    const token = useSelector((state)=> state.auth.token); // 리덕스 툴킷에 저자한 토큰값 가져오기

    const navigate = useNavigate();

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
        postTokenData("shop/add",addItemFormData,token)
            .then(res => navigate("/shop"))
            .catch(); // 여기는 token 해당페이지에서 받아와서 인자로 token값 보내는 함수

    }

    const {images,handleImageChange,handleRemoveImage} = useImageUploader(true)



    return(
        <Container>
            <button onClick={() => console.log(userData)}>리덕스 유저값 확인버튼</button>
            <button onClick={() => console.log(token)}>리덕스 토큰값 확인버튼</button>
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