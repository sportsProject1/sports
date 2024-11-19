import React from "react";
import { Link, Outlet } from "react-router-dom";
import styled from "styled-components";
import UserList from "./UserList";

// Styled Components
const AdminContainer = styled.div`
    display: flex;
    height: 100vh;
`;

const Sidebar = styled.nav`
    width: 200px;
    background: #f4f4f4;
    padding: 20px;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
`;

const SidebarTitle = styled.h2`
    margin: 20px auto;
    font-size: 1.5rem;
    color: #333;
`;

const SidebarMenu = styled.ul`
    list-style: none;
    padding: 0;
`;

const SidebarMenuItem = styled.li`
    margin-bottom: 10px;
`;

const SidebarLink = styled(Link)`
    text-decoration: none;
    color: #333;
    font-weight: bold;

    &:hover {
        text-decoration: underline;
    }
`;

const Content = styled.div`
    flex: 1;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
`;

function AdminPage() {
    return (
        <AdminContainer>
            {/* 사이드바 */}
            <Sidebar>
                <SidebarTitle>관리자메뉴</SidebarTitle>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarLink to="/admin/users">▶ 사용자 관리</SidebarLink>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarLink to="/admin/posts">▶ 게시물 관리</SidebarLink>
                    </SidebarMenuItem>
                </SidebarMenu>
            </Sidebar>

            {/* 메인 콘텐츠 */}
            <Content>
                <Outlet />
            </Content>
        </AdminContainer>
    );
}

export default AdminPage;
