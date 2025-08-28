// 购物车类
class Cart {
  constructor() {
    this.items = []; // [{id, name, price, qty}]
  }

  // 1. 添加商品
  add(name, price, qty = 1) {
    if (!name || price <= 0 || qty <= 0) return;
    const id = Date.now(); // 简单唯一 id
    this.items.push({ id, name, price: Number(price), qty: Number(qty) });
  }

  // 2. 删除商品
  remove(id) {
    this.items = this.items.filter(item => item.id !== id);
  }

  // 3. 修改数量
  updateQty(id, newQty) {
    this.items = this.items.map(item =>
      item.id === id ? { ...item, qty: Number(newQty) } : item
    );
  }

  // 4. 计算总价（reduce 累加）
  getTotal() {
    return this.items.reduce((sum, item) => sum + item.price * item.qty, 0).toFixed(2);
  }

  // 5. 清空
  clear() {
    this.items = [];
  }

  // 6. 转字符串（调试用）
  toString() {
    return JSON.stringify(this.items, null, 2);
  }
}

/* ===== 页面交互 ===== */
const cart = new Cart();
const list = document.getElementById('list');
const total = document.getElementById('total');

function render() {
  list.innerHTML = cart.items
    .map(
      ({ id, name, price, qty }) => `
        <li>
          ${name} × ${qty}  ¥${(price * qty).toFixed(2)}
          <div>
            <button onclick="cart.updateQty(${id}, prompt('新数量', ${qty}))">改</button>
            <button onclick="cart.remove(${id});render()">删</button>
          </div>
        </li>`
    )
    .join('');
  total.textContent = cart.getTotal();
}

/* 暴露到全局，HTML 里才能 onclick */
window.addItem = () => {
  const name = document.getElementById('name').value.trim();
  const price = document.getElementById('price').value;
  const qty = document.getElementById('qty').value;
  cart.add(name, price, qty);
  render();
  document.getElementById('name').value = '';
  document.getElementById('price').value = '';
  document.getElementById('qty').value = 1;
};

window.clearCart = () => {
  cart.clear();
  render();
};
window.updateQty =(id, newQty) => {
  newQty = prompt('新数量', newQty);
  if (newQty !== null && newQty > 0) {
    cart.updateQty(id, newQty);
    render();
  }
}
window.remove = id => {
  cart.remove(id); render();
};
// 首次渲染
render();