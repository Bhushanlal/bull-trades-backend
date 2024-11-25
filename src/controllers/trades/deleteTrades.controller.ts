import { Request, Response } from "express";
import { responseHandler } from "../../utils/responseHandler";
import { JwtPayload } from "jsonwebtoken";
import { decodeDetails } from "../../services/user.services";
import Trade from "../../models/tradeModel";
export const handleDeleteTrades = async (req: Request, res: Response) => {
try {
    const {deletedIds} = req.body;
    if(!deletedIds.length ){
        return responseHandler(
            res,
            true,
            "Empty deleted id's array not allowed.",
            null,
            400
          );  
    }
} catch (error) {
    console.error(error);
    return responseHandler(
      res,
      true,
      "Error in deleting trades.",
      null,
      500
    );
}
}