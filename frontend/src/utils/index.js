// 格式化日期
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};
// 格式化价格
export const formatPrice = (price) => {
    return `¥${price.toFixed(2)}`;
};
// 本地存储工具
export const storage = {
    get: (key) => {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        }
        catch (error) {
            console.error('Error getting data from localStorage:', error);
            return null;
        }
    },
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        }
        catch (error) {
            console.error('Error setting data to localStorage:', error);
        }
    },
    remove: (key) => {
        try {
            localStorage.removeItem(key);
        }
        catch (error) {
            console.error('Error removing data from localStorage:', error);
        }
    },
    clear: () => {
        try {
            localStorage.clear();
        }
        catch (error) {
            console.error('Error clearing localStorage:', error);
        }
    }
};
// 验证手机号
export const isValidPhone = (phone) => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
};
// 防抖函数
export const debounce = (func, waitFor) => {
    let timeout = null;
    return (...args) => {
        if (timeout) {
            clearTimeout(timeout);
        }
        return new Promise(resolve => {
            timeout = setTimeout(() => {
                resolve(func(...args));
            }, waitFor);
        });
    };
};
// 生成随机ID
export const generateId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};
