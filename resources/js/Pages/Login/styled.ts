import styled from 'styled-components';

export const LoginContainer = styled.main`
  align-items: center;
  display: grid;
  min-height: 100vh;
  padding: 24px;
  position: relative;
`;

export const AuthLanguageSelectWrapper = styled.div`
  position: absolute;
  right: 24px;
  top: 24px;

  &::after {
    color: #64748b;
    content: '▾';
    font-size: 12px;
    pointer-events: none;
    position: absolute;
    right: 11px;
    top: 50%;
    transform: translateY(-50%);
  }
`;

export const AuthLanguageSelect = styled.select`
  appearance: none;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 12px 34px rgb(15 23 42 / 8%);
  color: #0f172a;
  cursor: pointer;
  font-size: 13px;
  font-weight: 900;
  min-height: 38px;
  padding: 0 30px 0 12px;

  &:hover {
    background: #f8fafc;
  }

  &:focus {
    border-color: #94a3b8;
    outline: 3px solid rgb(148 163 184 / 24%);
  }
`;

export const Panel = styled.form`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 24px;
  box-shadow: 0 24px 80px rgb(15 23 42 / 12%);
  display: grid;
  gap: 18px;
  margin: 0 auto;
  max-width: 420px;
  padding: 28px;
  width: 100%;
`;

export const Brand = styled.div`
  align-items: center;
  display: flex;
  gap: 12px;
  justify-content: center;

  svg {
    flex: 0 0 auto;
  }
`;

export const Title = styled.h1`
  font-size: 26px;
  margin: 0;
`;

export const Help = styled.p`
  color: #64748b;
  line-height: 1.5;
  margin: 0;
  text-align: center;
`;

export const Input = styled.input`
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  padding: 12px 14px;
`;

export const Button = styled.button<{ $mainColor?: string }>`
  background: ${({ $mainColor }) => $mainColor ?? '#2563eb'};
  border: 0;
  border-radius: 12px;
  color: #ffffff;
  font-weight: 800;
  padding: 12px 16px;
`;

export const LinkRow = styled.div`
  display: flex;
  justify-content: center;
`;

export const TextLink = styled.a<{ $mainColor?: string }>`
  color: ${({ $mainColor }) => $mainColor ?? '#2563eb'};
  font-weight: 800;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
