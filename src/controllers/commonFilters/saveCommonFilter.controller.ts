import { Request, Response } from "express";
import { responseHandler } from "../../utils/responseHandler";
import { JwtPayload } from "jsonwebtoken";
import { decodeDetails } from "../../services/user.services";
import AdvanceFilter from "../../models/advanceFilter";
import { formatDateStringToUTC } from "../../services/commonServices";

export const handleSaveCommonFilters = async (req: Request, res: Response) => {
  try {
    const decode = decodeDetails(req.cookies.user_detail) as JwtPayload;
    const { userId } = decode;
    const {
      otmPuts,
      otmCalls,
      priceLessThanTwo,
      sizeGreater500,
      sentiment,
      callOrPut,
      priceStart,
      priceEnd,
      expirationStart,
      expirationEnd,
      region,
    } = req.body;

    let expirationStartFormat: any = null;
    if (expirationStart) {
      expirationStartFormat = formatDateStringToUTC(expirationStart, region);
    }

    let expirationEndFormat: any = null;
    if (expirationEnd) {
      expirationEndFormat = formatDateStringToUTC(expirationEnd, region);
    }

    const updatedFilters = await AdvanceFilter.findOneAndUpdate(
      { userId },
      {
        otmCalls,
        otmPuts,
        priceLessThanTwo,
        sizeGreater500,
        sentiment,
        callOrPut,
        priceStart,
        priceEnd,
        userId,
        expirationStart: expirationStartFormat,
        expirationEnd: expirationEndFormat,
      },
      {
        new: true, // Return the updated document
        upsert: true, // Create the document if it doesn't exist
        projection: {
          otmCalls: 1,
          otmPuts: 1,
          priceLessThanTwo: 1,
          sizeGreater500: 1,
          sentiment: 1,
          callOrPut: 1,
          priceStart: 1,
          priceEnd: 1,
          expirationStart: 1,
          expirationEnd: 1,
        },
      }
    );

    return responseHandler(
      res,
      false,
      "Filters saved successfully",
      updatedFilters,
      200
    );
  } catch (error) {
    console.error(error);
    return responseHandler(res, true, "Error in saving filters", null, 500);
  }
};
