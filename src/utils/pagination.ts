export class PaginationDto {
    page: number;
    size: number;
}

export const pagination = (page: number, size: number) => {
    return {
        skip: (page - 1) * size,
        take: size
    }
} 