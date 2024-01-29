export default function normalizeDestinations(data) {
	const nonFeeItems = data.filter((item) => !item.fee);
	const feeItems = data.filter((item) => item.fee);

	// Calculate total split of non-fee items
	const totalSplit = nonFeeItems.reduce((acc, item) => acc + item.split, 0);

	// Normalize splits to percentages of the total
	nonFeeItems.forEach((item) => (item.split = (item.split / totalSplit) * 100));

	// Merge fee and non-fee items
	const normalizedData = nonFeeItems.concat(feeItems);

	return normalizedData;
}
