import type {
  ActiveDiscountOverlay,
  DiscountStartPayload,
  DiscountUpdatedPayload,
} from "../../../types/socket.types";
import { DiscountType } from "../../../types/socket.types";

export function mapStartDiscountPayloadToOverlay(
  payload: DiscountStartPayload,
): ActiveDiscountOverlay {
  const label =
    payload.label?.trim() ||
    (payload.type === DiscountType.FREE_SHIPPING ? "Free Shipping" : "");

  return {
    type: payload.type,
    value: payload.value,
    label,
    startedAt: new Date(),
  };
}

export function mapDiscountToUpdatedPayload(
  roomCode: string,
  discount: ActiveDiscountOverlay,
): DiscountUpdatedPayload {
  return {
    roomCode,
    discount: { ...discount },
  };
}