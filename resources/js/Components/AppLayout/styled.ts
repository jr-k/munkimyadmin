import styled from 'styled-components';
import { Link } from '@inertiajs/react';

export const AppLayoutContainer = styled.div`
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  height: 100vh;
  overflow: hidden;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
    height: auto;
    min-height: 100vh;
    overflow: visible;
  }
`;

export const Sidebar = styled.aside`
  background: #0f172a;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 28px;
  height: 100vh;
  min-height: 0;
  overflow-y: auto;
  padding: 22px;

  @media (max-width: 860px) {
    height: auto;
    min-height: auto;
    overflow: visible;
  }
`;

export const Navigation = styled.nav`
  display: grid;
  gap: 24px;
`;

export const NavSection = styled.div`
  display: grid;
  gap: 8px;
`;

export const SectionTitle = styled.div`
  color: #94a3b8;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.12em;
  padding: 0 12px;
  text-transform: uppercase;
`;

export const NavLink = styled(Link)<{ $active?: boolean; $mainColor: string }>`
  background: ${({ $active, $mainColor }) => ($active ? `${$mainColor}55` : 'transparent')};
  border: 1px solid ${({ $active, $mainColor }) => ($active ? `${$mainColor}88` : 'transparent')};
  border-radius: 14px;
  color: #ffffff;
  display: block;
  font-weight: 800;
  padding: 11px 12px;
  text-decoration: none;

  &:hover {
    background: rgb(255 255 255 / 12%);
  }
`;

export const SidebarFooter = styled.div`
  display: grid;
  gap: 12px;
  margin-top: auto;

  @media (max-width: 860px) {
    margin-top: 0;
  }
`;

export const LanguageSelectWrapper = styled.div`
  position: relative;
  width: fit-content;

  &::after {
    color: #94a3b8;
    content: '▾';
    font-size: 12px;
    pointer-events: none;
    position: absolute;
    right: 11px;
    top: 50%;
    transform: translateY(-50%);
  }
`;

export const LanguageSelect = styled.select`
  appearance: none;
  background: rgb(255 255 255 / 8%);
  border: 1px solid rgb(255 255 255 / 12%);
  border-radius: 12px;
  color: #ffffff;
  cursor: pointer;
  font-size: 12px;
  font-weight: 900;
  min-height: 34px;
  padding: 0 30px 0 11px;

  option {
    color: #0f172a;
  }

  &:hover {
    background: rgb(255 255 255 / 12%);
  }

  &:focus {
    border-color: rgb(255 255 255 / 28%);
    outline: 3px solid rgb(255 255 255 / 12%);
  }
`;

export const ProjectMeta = styled.div`
  align-items: center;
  color: #64748b;
  display: flex;
  font-size: 12px;
  font-weight: 800;
  justify-content: flex-start;
  padding: 0 2px;
`;

export const GitHubLink = styled.a`
  align-items: center;
  color: #94a3b8;
  display: inline-flex;
  gap: 7px;
  text-decoration: none;

  &:hover {
    color: #ffffff;
  }
`;

export const Brand = styled.div`
  align-items: center;
  display: flex;
  gap: 12px;

  svg {
    flex: 0 0 auto;
  }
`;

export const Title = styled.h1`
  font-size: 20px;
  line-height: 1.1;
  margin: 0;
`;

export const Subtitle = styled.span`
  color: #cbd5e1;
  font-size: 13px;
`;

export const Main = styled.main`
  align-items: stretch;
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: 100vh;
  min-height: 0;
  overflow-y: auto;
  padding: 28px;
  width: 100%;

  > * {
    flex: 0 0 auto;
  }

  @media (max-width: 860px) {
    height: auto;
    min-height: 0;
    overflow: visible;
  }

  @media (max-width: 640px) {
    padding: 16px;
  }
`;

export const SafeModeBanner = styled.div`
  background: #fff7ed;
  border: 1px solid #fdba74;
  border-radius: 16px;
  color: #9a3412;
  display: grid;
  gap: 4px;
  padding: 14px 16px;

  strong {
    color: #c2410c;
    font-size: 14px;
    font-weight: 900;
    text-transform: uppercase;
  }

  span {
    font-size: 14px;
    font-weight: 700;
    line-height: 1.4;
  }
`;

export const UserFooter = styled.div`
  align-items: center;
  border-top: 1px solid rgb(255 255 255 / 12%);
  display: flex;
  gap: 12px;
  justify-content: space-between;
  padding-top: 12px;
`;

export const SignedIn = styled.span`
  color: #94a3b8;
  display: grid;
  gap: 2px;
  font-size: 12px;
  line-height: 1.35;
  min-width: 0;
`;

export const SignedInEmail = styled.span`
  color: #ffffff;
  font-weight: 800;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const LogoutButton = styled.button`
  align-items: center;
  background: rgb(255 255 255 / 10%);
  border: 0;
  border-radius: 10px;
  color: #cbd5e1;
  display: inline-flex;
  flex: 0 0 auto;
  height: 36px;
  justify-content: center;
  padding: 0;
  width: 36px;

  &:hover {
    background: rgb(255 255 255 / 16%);
    color: #ffffff;
  }
`;
