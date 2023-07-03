import { Container, Row, Col, Image } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useStoreItems } from "../context/StoreItemsContext";
import { StoreItemProps } from "../components/StoreItem";
import { formatCurrency } from "../utilities/formatCurrency";
import { AddItem } from "../components/AddItem";
import Colors from "../style/colors";

export function Product() {
  const { id } = useParams();
  const { storeItems } = useStoreItems();

  const item: StoreItemProps | undefined = storeItems.find(
    (item) => item.id === Number(id)
  );
  if (item == null) return null;

  return (
    <Container>
      <Row md={2} xs={1}>
        <Col>
          <Image className="my-4" alt={item.title} src={item.image} fluid />
        </Col>
        <Col className="d-flex justify-content-center flex-column">
          <h1 style={{ color: Colors.textPrimary }}>{item.title}</h1>
          <p className="mb-4 text-success fw-bold fs-3">
            {formatCurrency(item.price)}
          </p>
          <p className="mb-5">{item.description}</p>
          <AddItem id={Number(id)} />
        </Col>
      </Row>
    </Container>
  );
}
