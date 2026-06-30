import styled from 'styled-components';

type ModalTone = 'danger' | 'success';

export const Overlay = styled.div`
  backdrop-filter: blur(8px);
  background: rgb(15 23 42 / 55%);
  inset: 0;
  padding: 24px;
  position: fixed;
  z-index: 100;
`;

export const Dialog = styled.div<{ $tone: ModalTone }>`
  background:
    radial-gradient(
      circle at top left,
      ${({ $tone }) => ($tone === 'success' ? 'rgb(220 252 231 / 72%)' : 'rgb(254 226 226 / 70%)')},
      transparent 34%
    ),
    #ffffff;
  border: 1px solid rgb(255 255 255 / 70%);
  border-radius: 24px;
  box-shadow: 0 24px 80px rgb(15 23 42 / 28%);
  left: 50%;
  max-width: 440px;
  padding: 26px;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: min(100%, 440px);

  > * + * {
    margin-top: 18px;
  }
`;

export const Header = styled.div`
  display: block;

  &::after {
    clear: both;
    content: '';
    display: table;
  }
`;

export const Icon = styled.div<{ $tone: ModalTone }>`
  background: ${({ $tone }) => ($tone === 'success' ? '#dcfce7' : '#fee2e2')};
  border: 1px solid ${({ $tone }) => ($tone === 'success' ? '#bbf7d0' : '#fecaca')};
  border-radius: 18px;
  color: ${({ $tone }) => ($tone === 'success' ? '#15803d' : '#b91c1c')};
  display: inline-block;
  font-size: 24px;
  font-weight: 900;
  height: 52px;
  line-height: 52px;
  text-align: center;
  width: 52px;
`;

export const CloseButton = styled.button`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  color: #475569;
  display: inline-block;
  float: right;
  font-size: 20px;
  font-weight: 800;
  height: 36px;
  line-height: 1;
  padding: 0;
  width: 36px;

  &:hover {
    background: #fee2e2;
    border-color: #fecaca;
    color: #b91c1c;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const Title = styled.h2`
  color: #0f172a;
  font-size: 22px;
  line-height: 1.15;
  margin: 0;
`;

export const Description = styled.p`
  color: #475569;
  line-height: 1.55;
  margin: 0;
`;

export const ConfirmationLabel = styled.label`
  background: #fff7ed;
  border: 1px solid #fed7aa;
  border-radius: 12px;
  color: #9a3412;
  display: block;
  font-size: 13px;
  font-weight: 800;
  line-height: 1.4;
  padding: 10px 12px;

  &::after {
    clear: both;
    content: '';
    display: table;
  }
`;

export const ConfirmationCheckbox = styled.input`
  float: left;
  margin-right: 10px;
  margin-top: 2px;
`;

export const Actions = styled.div`
  display: block;
  text-align: right;
`;

export const ConfirmButton = styled.button<{ $tone: ModalTone }>`
  background: ${({ $tone }) => (
    $tone === 'success'
      ? 'linear-gradient(135deg, #22c55e, #15803d)'
      : 'linear-gradient(135deg, #dc2626, #991b1b)'
  )};
  border: 0;
  border-radius: 12px;
  box-shadow: 0 12px 24px ${({ $tone }) => ($tone === 'success' ? 'rgb(34 197 94 / 22%)' : 'rgb(220 38 38 / 22%)')};
  color: #ffffff;
  display: inline-block;
  font-weight: 900;
  padding: 11px 16px;

  &:hover {
    filter: brightness(1.04);
  }

  &:disabled {
    cursor: not-allowed;
    filter: grayscale(0.3);
    opacity: 0.45;
  }
`;

export const ButtonSpinner = styled.span`
  animation: spin 0.8s linear infinite;
  border: 2px solid rgb(255 255 255 / 45%);
  border-top-color: #ffffff;
  border-radius: 999px;
  display: inline-block;
  height: 14px;
  margin-right: 8px;
  vertical-align: -2px;
  width: 14px;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
