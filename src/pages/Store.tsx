import { Col, Row } from "react-bootstrap";
import { useStoreItems } from "../context/StoreItemsContext";
import { StoreItem } from "../components/StoreItem";
import { getUser } from "../service/AuthService";
import Colors from "../style/colors";

export function Store() {
  const user = getUser();
  const username = user !== "undefined" && user ? user.username : "";
  const { storeItems } = useStoreItems();

  return (
    <>
      <h2
        className="my-4"
        style={{
          color: Colors.secondary,
          fontStyle: "italic",
          fontFamily: "Roboto",
        }}
      >
        Welcome back, {username}
      </h2>
      <Row md={2} xs={1} lg={3} className="g-3">
        {storeItems.map((item) => (
          <Col>
            <StoreItem {...item} />
          </Col>
        ))}
      </Row>
    </>
  );
}
