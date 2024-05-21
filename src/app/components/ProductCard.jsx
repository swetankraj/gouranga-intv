import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";

const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card className="card" sx={{ width: "100%" }}>
      <CardMedia
        component="img"
        alt="green iguana"
        height="240"
        image={product.image}
      />

      <CardContent>
        <Typography gutterBottom>{product.name}</Typography>
        <Typography variant="h6" gutterBottom fontWeight="700">
          ${product.cost}
        </Typography>

        <Rating
          name="read-only"
          defaultValue={product.rating}
          readOnly
          precision={0.5}
          // onChange={(event, newValue) => {
          //   setValue(newValue);
          // }}
        />

        <br />
      </CardContent>
      <CardActions>
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddShoppingCartOutlined />}
          onClick={handleAddToCart}
        >
          ADD TO CART
        </Button>
      </CardActions>
      <br />
    </Card>
  );
};

export default ProductCard;
