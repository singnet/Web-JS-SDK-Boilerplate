import { Button } from "@mantine/core";
import { useSdk } from "providers/ServiceMetadataProvider";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode;
}

export const ActionButton: React.FC<ButtonProps> = ({ children, ...props }) => {
    const { isLoading, servicePrice } = useSdk();
    return (
        <Button
            {...props}
            loading={isLoading}
            disabled={isLoading}
            variant="filled"
            color="rgba(127, 27, 164, 1)"
            className="btn-primary btn-medium"
        >
            {children} {servicePrice && `(${servicePrice} AGIX)`}
        </Button>
    )
}