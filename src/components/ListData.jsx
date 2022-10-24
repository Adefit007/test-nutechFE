import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Container, Form, Modal, Table } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import icon from "../assets/iconapp.svg";
import { API } from "../config/api";
import { UserContext } from "../context/useContext";
import ModalButton from "./ModalButton";
import ModalButtonUpdate from "./ModalButtonUpdate";

export default function ListData() {
  const [state, dispatch] = useContext(UserContext);

  let { data: products, refetch } = useQuery("productsCache", async () => {
    const response = await API.get("/products");
    return response.data.data;
  });

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [idDelete, setIdDelete] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleDelete = (id) => {
    setIdDelete(id);
    handleShow();
  };

  const handleDeletes = () => {
    setConfirmDelete(true);
  };

  const deleteById = useMutation(async (id) => {
    try {
      await API.delete("/product/" + id);
      refetch();
    } catch (error) {
      console.log(error);
    }
  });

  useEffect(() => {
    if (confirmDelete) {
      handleClose();
      deleteById.mutate(idDelete);
      setConfirmDelete(null);
    }
  }, [confirmDelete]);

  let navigate = useNavigate();

  const logout = () => {
    dispatch({
      type: "LOGOUT",
    });
    navigate("/login");
  };

  const [filter, setFilter] = useState("");
  let searchData = (e) => {
    setFilter(e.target.value);
  };

  let dataFilter = products?.filter((item) => {
    if (filter === "") {
      return item;
    } else if (item.name.toLowerCase().includes(filter.toLowerCase())) {
      return item;
    }
  });

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
                <Form.Label>Cari Nama Barang</Form.Label>
                <Form.Control
                  type="search"
                  name="name"
                  id="name"
                  onChange={searchData.bind(this)}
                  style={{ width: "30%" }}
                />
              </Form.Group>
            </Form>
          </Card.Body>
        </Card>
        <ModalButton />
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
            {dataFilter?.map((item, index) => (
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
                    alt=""
                  />
                </td>
                <td className="align-middle">{item?.name}</td>
                <td>{item?.buyPrice}</td>
                <td>{item?.sellPrice}</td>
                <td>{item?.qty}</td>
                <td>
                  <ModalButtonUpdate item={item} key={index} />
                  {/* <Button
                    variant="warning"
                    style={{ width: "70px" }}
                    className="text-white me-2 pointer"
                  >
                    Edit
                  </Button> */}
                  <Button
                    onClick={() => {
                      handleDelete(item?.id);
                    }}
                    style={{ width: "70px" }}
                    variant="danger"
                    className="text-white pointer"
                  >
                    Delete
                  </Button>
                  <Modal show={show} onHide={handleClose} centered>
                    <Modal.Body>
                      <h3 className="text-center">Delete data</h3>
                      <div className="my-4">Anda yakin menghapus data ?</div>
                      <div className="my-3 text-end">
                        <Button
                          variant="danger"
                          className="me-2"
                          style={{ width: "100px" }}
                          onClick={handleDeletes}
                        >
                          Ok
                        </Button>
                        <Button
                          variant="secondary"
                          style={{ width: "100px" }}
                          onClick={handleClose}
                        >
                          Batal
                        </Button>
                      </div>
                    </Modal.Body>
                  </Modal>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </div>
  );
}
