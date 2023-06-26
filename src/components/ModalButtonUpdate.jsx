import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { API } from "../config/api";

export default function ModalButtonUpdate({ item }) {
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const [preview, setPreview] = useState(item.image);

  const { id } = useParams();

  const [product, setProduct] = useState({});

  const [form, setForm] = useState({
    name: item.name,
    image: item.image,
    buyPrice: item.buyPrice,
    sellPrice: item.sellPrice,
    qty: item.qty,
  });

  // useQuery("productCache", async () => {
  //   const response = await API.get("/product/" + item.id);
  //   setPreview(response?.data?.data?.image);
  //   setForm({
  //     ...form,
  //     name: response?.data?.data?.name,
  //     buyPrice: response?.data?.data?.buyPrice,
  //     sellPrice: response?.data?.data?.sellPrice,
  //     qty: response?.data?.data?.qty,
  //   });
  //   setProduct(response.data.data);
  // });

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
      // formData.set("image", form.image[0], form.image[0].name);
      if (form.image[0] instanceof File) {
        formData.set("image", form.image[0], form.image[0].name);
      }
      formData.set("name", form.name);
      formData.set("buyPrice", form.buyPrice);
      formData.set("sellPrice", form.sellPrice);
      formData.set("qty", form.qty);

      const response = await API.patch("/product/" + item.id, formData);
      console.log(response);
      setShow(!show);
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <>
      <Button
        onClick={handleShow}
        variant="warning"
        style={{ width: "70px" }}
        className="text-white me-2 pointer"
      >
        Edit
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Body>
          <h3 className="text-center">Edit Product</h3>
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
                defaultValue={item.name}
                onChange={handleChange}
                placeholder="name"
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                className="my-3"
                type="number"
                name="buyPrice"
                defaultValue={item.buyPrice}
                onChange={handleChange}
                placeholder="harga beli"
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                className="my-3"
                type="number"
                name="sellPrice"
                defaultValue={item.sellPrice}
                onChange={handleChange}
                placeholder="harga jual"
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                className="my-3"
                type="number"
                name="qty"
                defaultValue={item.qty}
                onChange={handleChange}
                placeholder="stok"
              />
            </Form.Group>
            <Button type="submit" className="mt-3" style={{ width: "100%" }}>
              Update
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
