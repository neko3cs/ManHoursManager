import { useContext } from "react";
import { useSelector } from "../Store";
import { Link } from "react-router-dom";
import { writeTextFile } from "@tauri-apps/api/fs";
import { save } from "@tauri-apps/api/dialog";
import { Box, Button } from "@mui/material";
import { Work, convertWorkToCsvRowString } from "../types/Work";
import { SnackBarAreaContext } from "./utils/SnackBarArea";

export const NavBar = () => {
  const works = useSelector<Work[]>(state => state.work.works);
  const { setMessage, setSeverity, openSnackBar } = useContext(SnackBarAreaContext);

  const handleCsvOutputButtonOnClick = async () => {
    const csv = "ここは無効行です。\n" + works.map(work => convertWorkToCsvRowString(work)).join("\n");
    const path = await save({ filters: [{ name: "CSV", extensions: ["csv"] }] });
    if (path) {
      await writeTextFile(path, csv);
      setMessage("CSV出力が完了しました。");
      setSeverity("success");
      openSnackBar();
    }
  };

  return (
    <Box
      display={{
        xs: "none",
        sm: "block"
      }}>
      <Button
        variant={"text"}
        color={"primary"}
        sx={{
          color: '#fff'
        }}
        onClick={handleCsvOutputButtonOnClick}>
        CSV出力
      </Button>
      <Button
        variant={"text"}
        color={"primary"}
        sx={{
          color: '#fff'
        }}
        component={Link}
        to="/">
        工数入力
      </Button>
      <Button
        variant={"text"}
        color={"primary"}
        sx={{
          color: '#fff'
        }}
        component={Link}
        to={"/settings"}>
        設定
      </Button>
    </Box>
  );
};