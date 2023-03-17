import {
  DialogType,
  Dialog,
  DialogFooter,
  PrimaryButton,
  DefaultButton,
} from "@fluentui/react";
import React, { useEffect, useState } from "react";
import { User } from "../models/user";
import { fetchUserById } from "../service";

type Props = {
  userId: number;
  hidden: boolean;
  onDismiss: () => void;
  handleOnClose: () => void;
  handleOnDelete: () => void;
};

export const DeleteUser = (props: Props) => {
  const [user, setUser] = useState<User>();

  const deleteDialogContentProps = {
    type: DialogType.normal,
    title: `Obriši korisnika ${user?.Name} ${user?.Surname}`,
    closeButtonAriaLabel: "Close",
    subText: `Da li ste sigurni da želite da obrišete korisnika ${user?.Name} ${user?.Surname}?`,
  };

  useEffect(() => {
    if (!props.hidden) {
      fetchUserById(props.userId)
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [props.hidden]);

  return (
    <Dialog
      hidden={props.hidden}
      onDismiss={props.onDismiss}
      dialogContentProps={deleteDialogContentProps}
    >
      <DialogFooter>
        <PrimaryButton onClick={props.handleOnClose} text="Otkaži" />
        <DefaultButton onClick={props.handleOnDelete} text="Obriši" />
      </DialogFooter>
    </Dialog>
  );
};
