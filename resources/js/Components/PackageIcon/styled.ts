import styled from 'styled-components';

type IconSize = 'sm' | 'md' | 'card' | 'lg';

const iconSizes: Record<IconSize, { borderRadius: string; fontSize: string; size: string }> = {
  sm: { borderRadius: '9px', fontSize: '11px', size: '28px' },
  md: { borderRadius: '12px', fontSize: '13px', size: '36px' },
  card: { borderRadius: '14px', fontSize: '18px', size: '52px' },
  lg: { borderRadius: '20px', fontSize: '26px', size: '76px' },
};

export const IconFrame = styled.span<{ $size: IconSize }>`
  background: #eef2ff;
  border: 1px solid #e0e7ff;
  border-radius: ${({ $size }) => iconSizes[$size].borderRadius};
  color: #3730a3;
  display: inline-block;
  flex: 0 0 ${({ $size }) => iconSizes[$size].size};
  font-size: ${({ $size }) => iconSizes[$size].fontSize};
  font-weight: 900;
  height: ${({ $size }) => iconSizes[$size].size};
  line-height: ${({ $size }) => iconSizes[$size].size};
  overflow: hidden;
  text-align: center;
  vertical-align: middle;
  width: ${({ $size }) => iconSizes[$size].size};
`;

export const IconImage = styled.img`
  height: 100%;
  object-fit: cover;
  width: 100%;
`;
