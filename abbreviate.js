// Code adapted from https://stackoverflow.com/questions/9461621/format-a-number-as-2-5k-if-a-thousand-or-more-otherwise-900

const SI_SYMBOL = ["", "k", "M", "B", "T", "P", "E"];

module.exports = (number) => {
  const tier = (Math.log10(number) / 3) | 0;

  if (tier == 0) return +Number(number).toFixed(2);

  const suffix = SI_SYMBOL[tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = number / scale;

  return scaled.toFixed(1) + suffix;
};
