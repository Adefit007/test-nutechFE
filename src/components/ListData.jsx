import React, { useContext } from "react";
import { Button, Card, Col, Container, Form, Table } from "react-bootstrap";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import icon from "../assets/iconapp.svg";
import { API } from "../config/api";
import { UserContext } from "../context/useContext";

export default function ListData() {
  const [state, dispatch] = useContext(UserContext);

  let navigate = useNavigate();

  const logout = () => {
    dispatch({
      type: "LOGOUT",
    });
    navigate("/login");
  };

  let { data: products, refetch } = useQuery("productsCache", async () => {
    const response = await API.get("/products");
    return response.data.data;
  });

  console.log(products);
  return (
    <div>
      <Container>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h3>
              <span>
                <img
                  src={icon}
                  style={{ width: "30px" }}
                  className="m-3"
                  alt=""
                />
              </span>
              Aplikasi Data Barang
            </h3>
          </div>
          <div>
            <Button onClick={logout}>Logout</Button>
          </div>
        </div>
        <Card>
          <Card.Body>
            <Form>
              <Form.Group>
                <Form.Label>Nama Barang</Form.Label>
                <Form.Control
                  type="search"
                  name="name"
                  style={{ width: "30%" }}
                />
              </Form.Group>
            </Form>
          </Card.Body>
        </Card>
        <Col className="text-end">
          <Button className="my-2 fw-bolder" style={{ width: "10%" }}>
            Add
          </Button>
        </Col>
        <Table
          responsive
          striped
          hover
          bordered
          className="align-middle text-center opacity-75"
        >
          <thead>
            <tr>
              <th>No</th>
              <th>Foto Barang</th>
              <th>Nama Barang</th>
              <th>Harga Beli</th>
              <th>Harga Jual</th>
              <th>Stok</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <img
                    src={item.image}
                    style={{
                      width: "70px",
                      height: "70px",
                      objectFit: "cover",
                    }}
                  />
                </td>
                <td className="align-middle">{item?.name}</td>
                <td>{item?.buyPrice}</td>
                <td>{item?.sellPrice}</td>
                <td>{item?.qty}</td>
                <td>
                  <Button variant="warning" className="text-white me-2 pointer">
                    Edit
                  </Button>
                  <Button variant="danger" className="text-white pointer">
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </div>
  );
}
