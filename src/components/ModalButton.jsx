import React, { useState } from "react";
import { Alert, Button, Col, Form, Modal } from "react-bootstrap";
import { useMutation } from "react-query";
import { API } from "../config/api";

export default function ModalButton() {
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => (
    setShow(false), setMessage(null), setPreview(null)
  );

  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState(null);

  const [form, setForm] = useState({
    name: "",
    image: "",
    buyPrice: "",
    sellPrice: "",
    qty: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "file" ? e.target.files : e.target.value,
    });

    if (e.target.type === "file") {
      let url = URL.createObjectURL(e.target.files[0]);
      setPreview(url);
    }
  };

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      const formData = new FormData();
      formData.set("image", form.image[0], form.image[0].name);
      formData.set("name", form.name);
      formData.set("buyPrice", form.buyPrice);
      formData.set("sellPrice", form.sellPrice);
      formData.set("qty", form.qty);

      const response = await API.post("/product", formData);
      console.log(response);
      setShow(!show);
    } catch (error) {
      if (error.message === "Request failed with status code 400") {
        const alert = <Alert variant="danger">file max 100 kB</Alert>;
        setMessage(alert);
      }
      console.log(error);
    }
  });

  return (
    <div>
      <Col className="text-end">
        <Button
          onClick={handleShow}
          className="my-2 fw-bolder"
          style={{ width: "10%" }}
        >
          Add
        </Button>
        <Modal show={show} onHide={handleClose}>
          <Modal.Body>
            {message}
            <h3 className="text-center">Add Product</h3>
            <Form onSubmit={(e) => handleSubmit.mutate(e)}>
              {preview && (
                <div>
                  <img
                    src={preview}
                    style={{
                      maxWidth: "150px",
                      maxHeight: "150px",
                      objectFit: "cover",
                    }}
                    alt="preview"
                  />
                </div>
              )}
              <input
                type="file"
                id="upload"
                name="image"
                hidden
                onChange={handleChange}
              />
              <label className="my-3 text-primary" htmlFor="upload">
                Upload File
              </label>
              <Form.Group>
                <Form.Control
                  className="my-3"
                  type="text"
                  name="name"
                  onChange={handleChange}
                  placeholder="name"
                  required
                />
              </Form.Group>
              <Form.Group>
                <Form.Control
                  className="my-3"
                  type="number"
                  name="buyPrice"
                  onChange={handleChange}
                  placeholder="harga beli"
                />
              </Form.Group>
              <Form.Group>
                <Form.Control
                  className="my-3"
                  type="number"
                  name="sellPrice"
                  onChange={handleChange}
                  placeholder="harga jual"
                />
              </Form.Group>
              <Form.Group>
                <Form.Control
                  className="my-3"
                  type="number"
                  name="qty"
                  onChange={handleChange}
                  placeholder="stok"
                />
              </Form.Group>
              <Button type="submit" className="mt-3" style={{ width: "100%" }}>
                Add
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Col>
    </div>
  );
}
