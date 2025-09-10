const fs = require('fs');
const path = require('path');

class ScenicSpot {
  constructor() {
    this.dataPath = path.join(__dirname, '../data/scenicSpots.json');
    this.ensureDataFile();
  }

  ensureDataFile() {
    const dataDir = path.dirname(this.dataPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(this.dataPath)) {
      fs.writeFileSync(this.dataPath, JSON.stringify([], null, 2));
    }
  }

  readData() {
    try {
      const data = fs.readFileSync(this.dataPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('读取景点数据失败:', error);
      return [];
    }
  }

  writeData(data) {
    try {
      fs.writeFileSync(this.dataPath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error('写入景点数据失败:', error);
      return false;
    }
  }

  // 获取所有景点
  getAll(page = 1, limit = 10, search = '') {
    const spots = this.readData();
    let filteredSpots = spots;

    // 搜索过滤
    if (search) {
      filteredSpots = spots.filter(spot => 
        spot.name.toLowerCase().includes(search.toLowerCase()) ||
        spot.description.toLowerCase().includes(search.toLowerCase()) ||
        spot.location.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 分页
    const total = filteredSpots.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedSpots = filteredSpots.slice(startIndex, endIndex);

    return {
      data: paginatedSpots,
      pagination: {
        current: page,
        pageSize: limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // 根据ID获取景点
  getById(id) {
    const spots = this.readData();
    return spots.find(spot => spot.id === id);
  }

  // 创建景点
  create(spotData) {
    const spots = this.readData();
    const newSpot = {
      id: Date.now().toString(),
      ...spotData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    spots.push(newSpot);
    
    if (this.writeData(spots)) {
      return newSpot;
    }
    return null;
  }

  // 更新景点
  update(id, updateData) {
    const spots = this.readData();
    const index = spots.findIndex(spot => spot.id === id);
    
    if (index === -1) {
      return null;
    }

    spots[index] = {
      ...spots[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    if (this.writeData(spots)) {
      return spots[index];
    }
    return null;
  }

  // 删除景点
  delete(id) {
    const spots = this.readData();
    const filteredSpots = spots.filter(spot => spot.id !== id);
    
    if (filteredSpots.length === spots.length) {
      return false; // 没有找到要删除的景点
    }

    return this.writeData(filteredSpots);
  }

  // 获取热门景点
  getPopular(limit = 6) {
    const spots = this.readData();
    return spots
      .sort((a, b) => (b.bookingCount || 0) - (a.bookingCount || 0))
      .slice(0, limit);
  }
}

module.exports = new ScenicSpot();