import React from 'react';
interface IconVisibleProps {
    isPasswordVisible: boolean;
}
const IconVisible: React.FC<IconVisibleProps> = ({ isPasswordVisible }) => (
    <i className={`pi ${isPasswordVisible ? 'pi-eye-slash' : 'pi-eye'}`} style={{ color: 'var(--text-color)' }}></i>
);
export default IconVisible;
