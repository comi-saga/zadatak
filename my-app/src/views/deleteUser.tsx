import { DialogType, Dialog, DialogFooter, PrimaryButton, DefaultButton } from "@fluentui/react";
import { useEffect, useState } from "react";
import { User } from "../models/user";
import { fetchUserById } from "../service";

type Props = {
    userId: number,
    hidden: boolean,
    onDismiss: () => void,
    handleOnClose: () => void,
    handleOnDelete: () => void
}

export const DeleteUser = (props:Props) =>{
    const [user, setUser] = useState<User>();

    const deleteDialogContentProps = {
        type: DialogType.normal,
        title: `Obrisi korisnika ${user?.Name} ${user?.Surname}`,
        closeButtonAriaLabel: "Close",
        subText: `Da li ste sigurni da zelite da obrisete korisnika ${user?.Name} ${user?.Surname}?`,
    };

    useEffect(() => {
    fetchUserById(props.userId)
      .then((response) => {
        setUser(response.data);

      })
      .catch((error) => {
        console.log(error);
      });
  }, [props.hidden]);

    return (
        <Dialog
            hidden={props.hidden}
            onDismiss={props.onDismiss}
            dialogContentProps={deleteDialogContentProps}
          >
            <DialogFooter>
              <PrimaryButton onClick={props.handleOnClose} text="Otkazi" />
              <DefaultButton onClick={props.handleOnDelete} text="Obrisi" />
            </DialogFooter>
          </Dialog>
    );
}