import React, { useState, useEffect } from 'react';

const ShopAdd = () => {
    const [title, setTitle] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [price, setPrice] = useState('');
    const [desc, setDesc] = useState('');
    const [stock, setStock] = useState('');
    const [imgurl, setImgurl] = useState('');
    const [categories, setCategories] = useState([]);

    const fetchCategories = async () => {
        const response = await fetch('http://localhost:8090/shop/post');
        const data = await response.json();
        setCategories(data);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const name = encodeURIComponent(file.name);
            const response = await fetch(`http://localhost:8090/shop/presigned-url?filename=${name}`);

            if (!response.ok) {
                console.error("Failed to get presigned URL:", response.status, response.statusText);
                return; // 함수 종료
            }

            const presignedUrl = await response.text();
            console.log("Presigned URL:", presignedUrl); // URL 확인

            const uploadResponse = await fetch(presignedUrl, {
                method: 'PUT',
                body: file,
            });

            if (uploadResponse.ok) {
                const uploadedUrl = presignedUrl.split("?")[0];
                setImgurl(uploadedUrl);
            } else {
                console.error("Failed to upload file:", uploadResponse.status, uploadResponse.statusText);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newItem = {
            title,
            categoryId,
            price: parseInt(price),
            desc,
            stock: parseInt(stock),
            imgurl,
        };

        const response = await fetch('http://localhost:8090/shop/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newItem),
        });

        if (response.ok) {
            alert('아이템이 성공적으로 추가되었습니다.');
            // 폼 초기화
            setTitle('');
            setCategoryId('');
            setPrice('');
            setDesc('');
            setStock('');
            setImgurl('');
        } else {
            console.error("Failed to add item:", response.statusText);
        }
    };

    return (
        <div>
            <h2>상품 추가</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="상품명"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    defaultValue=""
                >
                    <option value="" disabled>카테고리를 선택하세요</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>

                <input
                    type="number"
                    placeholder="가격"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="상품설명"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="재고"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                />
                <input
                    type="text"
                    id="imgurl"
                    value={imgurl}
                    readOnly
                />
                <button type="submit">전송</button>
                {imgurl && <img src={imgurl} alt="Uploaded" />}

                <input
                    type="file"
                    onChange={handleFileChange}
                />
            </form>
        </div>
    );
};

export default ShopAdd;
