import { carDummyData } from "../data/carDummyData";

const CAR_STORAGE_KEY = "usedCars";
const CAR_CHANGE_EVENT = "usedCarChange";

function normalizeCar(car) {
    const imageUrls =
        Array.isArray(car.imageUrls) && car.imageUrls.length > 0
            ? car.imageUrls
            : car.imageUrl
                ? [car.imageUrl]
                : ["/images/cars/default-car.jpg"];

    return {
        ...car,
        id: Number(car.id),
        sellerId: Number(car.sellerId),
        dealerId:
            car.dealerId === null || car.dealerId === undefined
                ? null
                : Number(car.dealerId),
        companyId:
            car.companyId === null || car.companyId === undefined
                ? null
                : Number(car.companyId),
        price: Number(car.price || 0),
        year: Number(car.year || 0),
        mileage: Number(car.mileage || 0),
        imageUrls,
        imageUrl:
            car.imageUrl ||
            imageUrls[0] ||
            "/images/cars/default-car.jpg",
        status: car.status || "판매중",
    };
}

function saveCars(cars) {
    localStorage.setItem(
        CAR_STORAGE_KEY,
        JSON.stringify(cars)
    );

    window.dispatchEvent(
        new Event(CAR_CHANGE_EVENT)
    );
}

export function getCarChangeEventName() {
    return CAR_CHANGE_EVENT;
}

export function getCars() {
    const savedCars =
        localStorage.getItem(CAR_STORAGE_KEY);

    if (!savedCars) {
        const initialCars =
            carDummyData.map(normalizeCar);

        saveCars(initialCars);

        return initialCars;
    }

    try {
        const parsedCars = JSON.parse(savedCars);

        if (!Array.isArray(parsedCars)) {
            throw new Error(
                "차량 데이터가 배열 형식이 아닙니다."
            );
        }

        return parsedCars.map(normalizeCar);
    } catch (error) {
        console.error(
            "차량 데이터 파싱 오류:",
            error
        );

        const initialCars =
            carDummyData.map(normalizeCar);

        saveCars(initialCars);

        return initialCars;
    }
}

export function getCarById(carId) {
    return getCars().find(
        (car) =>
            Number(car.id) === Number(carId)
    );
}

export function getCarsBySeller(
    sellerId,
    sellerType
) {
    return getCars().filter(
        (car) =>
            Number(car.sellerId) ===
            Number(sellerId) &&
            car.sellerType === sellerType
    );
}

export function createCar(carData) {
    const cars = getCars();

    const nextId =
        cars.length > 0
            ? Math.max(
                ...cars.map((car) =>
                    Number(car.id)
                )
            ) + 1
            : 1;

    const newCar = normalizeCar({
        id: nextId,
        registeredDate: new Date()
            .toISOString()
            .slice(0, 10),
        status: "판매중",
        ...carData,
    });

    saveCars([newCar, ...cars]);

    return newCar;
}

export function updateCar(
    carId,
    carData
) {
    let updatedCar = null;

    const nextCars = getCars().map(
        (car) => {
            if (
                Number(car.id) !==
                Number(carId)
            ) {
                return car;
            }

            updatedCar = normalizeCar({
                ...car,
                ...carData,
                updatedDate: new Date()
                    .toISOString()
                    .slice(0, 10),
            });

            return updatedCar;
        }
    );

    if (!updatedCar) {
        return null;
    }

    saveCars(nextCars);

    return updatedCar;
}

export function updateCarStatus(
    carId,
    status
) {
    return updateCar(carId, {
        status,
    });
}

export function deleteCar(carId) {
    const cars = getCars();

    const targetCar = cars.find(
        (car) =>
            Number(car.id) === Number(carId)
    );

    if (!targetCar) {
        return false;
    }

    const nextCars = cars.filter(
        (car) =>
            Number(car.id) !== Number(carId)
    );

    saveCars(nextCars);

    return true;
}