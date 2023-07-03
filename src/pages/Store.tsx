import { Col, Row, Dropdown } from "react-bootstrap";
import { useStoreItems } from "../context/StoreItemsContext";
import { StoreItem } from "../components/StoreItem";
import { getUser } from "../service/AuthService";
import { getSortedItems } from "../utilities/getSortedItems";
import { useReducer } from "react";
import Colors from "../style/colors";

type State = {
  sortBy: string;
};

type Action = {
  type: string;
  payload: string;
};

const reducer = (state: State, action: Action) => {
  return { ...state, sortBy: action.payload };
};

export function Store() {
  const [{ sortBy }, dispatch] = useReducer(reducer, { sortBy: "none" });
  const user = getUser();
  const username = user !== "undefined" && user ? user.username : "";
  const { storeItems } = useStoreItems();
  const sortedItems = getSortedItems(storeItems, sortBy);

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
      <Dropdown className="my-3">
        <Dropdown.Toggle
          id="dropdown-sortby"
          style={{
            backgroundColor: Colors.secondary,
            borderColor: Colors.primary,
          }}
        >
          Sort By
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item
            onClick={() =>
              dispatch({ type: "SORT", payload: "PRICE_LOW_TO_HIGH" })
            }
          >
            price - low to high
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() =>
              dispatch({ type: "SORT", payload: "PRICE_HIGH_TO_LOW" })
            }
          >
            price - high to low
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <Row md={2} xs={1} lg={3} className="g-3">
        {sortedItems.map((item, i) => (
          <Col key={i}>
            <StoreItem {...item} />
          </Col>
        ))}
      </Row>
    </>
  );
}
