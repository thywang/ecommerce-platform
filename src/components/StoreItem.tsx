import { Card } from "react-bootstrap";
import { formatCurrency } from "../utilities/formatCurrency";
import { useNavigate } from "react-router-dom";
import { AddItem } from "./AddItem";

export type StoreItemProps = {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
};

export function StoreItem({ id, title, price, image }: StoreItemProps) {
  const navigate = useNavigate();

  const siteSelectedCallback = () => {
    navigate("/products/" + id);
  };

  return (
    <Card className="h-100">
      <Card.Img
        className="py-3"
        onClick={siteSelectedCallback}
        variant="top"
        src={image}
        height="200px"
        style={{ cursor: "pointer", objectFit: "contain" }}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title className="d-flex justify-content-between align-items-baseline mb-4">
          <span
            onClick={siteSelectedCallback}
            style={{ cursor: "pointer" }}
            className="fs-4"
          >
            {title}
          </span>
          <span className="ms-2 me-1 text-muted">{formatCurrency(price)}</span>
        </Card.Title>
        <div className="mt-auto">
          <AddItem id={id} />
        </div>
      </Card.Body>
    </Card>
  );
}
