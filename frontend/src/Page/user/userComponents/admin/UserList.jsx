import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { lightTheme } from '../../../../styled/theme';
import UserRoleEditor from "./UserRoleEditor";
import { fetchTokenData } from "../../../../Server/ApiService";

// Styled Components
const Container = styled.div`
    padding: 20px;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
`;

const Th = styled.th`
    border: 1px solid #ddd;
    padding: 10px;
    background-color: #d3d3d35e;
`;

const Td = styled.td`
    border: 1px solid #ddd;
    padding: 10px;
`;

const ActionTd = styled(Td)`
    text-align: center;
`;

const Button = styled.button`
    background-color: ${(props) => props.theme.colors.primary};
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    border-radius: 4px;

    &:hover {
        background-color: ${(props) => props.theme.colors.secondary};
    }
`;

function UserList() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        fetchTokenData("/admin/users")
            .then((res) => {
                console.log("Fetched data:", res);
                setUsers(res.data); // 상태 업데이트
            })
            .catch((error) => {
                console.error("Failed to fetch users:", error);
            });
    }, []);

    const openRoleEditor = (user) => {
        setSelectedUser(user);
    };

    const closeRoleEditor = () => {
        setSelectedUser(null);
    };

    return (
        <Container>
            <h1>User Management</h1>
            <Table>
                <thead>
                    <tr>
                        <Th>고유 ID</Th>
                        <Th>사용자 ID</Th>
                        <Th>이메일</Th>
                        <Th>권한</Th>
                        <Th>설정</Th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <Td>{user.id}</Td>
                            <Td>{user.username}</Td>
                            <Td>{user.email}</Td>
                            <Td>{user.role}</Td>
                            <ActionTd>
                                <Button onClick={() => openRoleEditor(user)}>Edit Role</Button>
                            </ActionTd>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {selectedUser && (
                <UserRoleEditor user={selectedUser} onClose={closeRoleEditor} />
            )}
        </Container>
    );
}

export default UserList;
