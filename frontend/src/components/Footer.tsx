import React from 'react';
import { Layout } from 'antd';
import './Footer.css';

const { Footer: AntFooter } = Layout;

const Footer: React.FC = () => {
  return (
    <AntFooter className="footer">
      <div className="container">
        <div className="footer-content">
          <p>景点预订网站 &copy; {new Date().getFullYear()} 版权所有</p>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer;