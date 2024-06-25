let searchCommand = `SELECT id , productName , image , price FROM products WHERE productName LIKE ? limit 10;`;
let getOrderItems = `SELECT 
  p.id AS product_id,
  p.productName,
  p.price,
  p.description
FROM 
  order_items oi
JOIN 
  products p ON oi.product_id = p.id
WHERE 
  oi.order_id = ?;
`;
let getOrdersOfUsers = `SELECT 
  o.id AS order_id,
  o.user_id,
  o.order_status,
  GROUP_CONCAT(oi.product_id ORDER BY oi.product_id) AS product_ids
FROM 
  orders o
JOIN 
  order_items oi ON o.id = oi.order_id
WHERE 
  o.user_id = ?
GROUP BY 
  o.id, o.user_id, o.order_status;

`;
let getAllProducts = `select * from products`;
let singleProduct = `select * from products where id = ?`;
let getUserDetails = `select  id , username from users where id = ?`;
let loginUser = `select id , username , password from users where username = ?`;
let signUpUser = `insert into users 
  (firstName , lastname , password , username)
  values
  ( ? , ? , ? , ?)
  `;

// stripe commands
let getProductDetails = `select * from products where id = ?`;
let createOrderID = `insert into orders (user_id) values (?)`;
let createOrderItems = `insert into order_items (order_id, product_id) values (? , ?)`;
export {
  searchCommand,
  getOrderItems,
  getOrdersOfUsers,
  singleProduct,
  getAllProducts,
  getUserDetails,
  loginUser,
  signUpUser,
  createOrderID,
  createOrderItems,
  getProductDetails,
};
