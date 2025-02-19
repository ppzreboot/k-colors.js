(function() {
  "use strict";
  function is_same_point(d, A, B) {
    for (let i = 0; i < d; i++)
      if (A[i] !== B[i])
        return false;
    return true;
  }
  function calc_squared_distance(dimension, A, B) {
    let sum = 0;
    for (let i = 0; i < dimension; i++)
      sum += (A[i] - B[i]) ** 2;
    return sum;
  }
  function find_min(nums) {
    if (nums.length < 1)
      throw Error("too few nums");
    let min = [0, nums[0]];
    for (let i = 1; i < nums.length; i++)
      if (nums[i] < min[1])
        min = [i, nums[i]];
    return min;
  }
  function calc_mean(dimension, cluster) {
    if (cluster.length === 0)
      return [false, "too few elements"];
    const mean = [];
    for (let i = 0; i < dimension; i++)
      mean[i] = cluster.reduce((sum, point) => sum += point[i], 0) / cluster.length;
    return [true, mean];
  }
  function calc_range(d, points) {
    const min = new Array(d).fill(Infinity);
    const max = new Array(d).fill(-Infinity);
    for (const point of points)
      for (let i = 0; i < d; i++) {
        if (point[i] < min[i])
          min[i] = point[i];
        if (point[i] > max[i])
          max[i] = point[i];
      }
    return { min, max };
  }
  function k_means(d, points, k, range = calc_range(d, points), means = []) {
    let count = 0;
    while (true) {
      count++;
      const old_means = means.slice();
      while (old_means.length < k)
        old_means.push(random_mean(range));
      const clusters = converge(d, points, old_means);
      const new_means = clusters.map((cluster) => cluster.mean);
      if (is_converged(d, old_means, new_means))
        return [clusters, count];
      else
        means = new_means;
    }
  }
  function converge(d, points, means) {
    const map = new Map(
      // mean => index
      means.map((m) => [m, []])
    );
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      const [shortest] = find_min(means.map((mean) => calc_squared_distance(d, mean, point)));
      map.get(means[shortest]).push(i);
    }
    return Array.from(map.values()).map((indices) => {
      if (indices.length === 0)
        return null;
      const [ok, mean] = calc_mean(d, indices.map((i) => points[i]));
      if (!ok)
        throw Error("Unkown Error");
      return { indices, mean };
    }).filter((cluster) => cluster !== null);
  }
  function random_mean(range) {
    const point = [];
    for (let i = 0; i < range.min.length; i++) {
      const span = range.max[i] - range.min[i];
      point[i] = Math.random() * span + range.min[i];
    }
    return point;
  }
  function is_converged(d, means_a, means_b) {
    const length = means_a.length;
    if (length !== means_b.length)
      return false;
    for (let i = 0; i < length; i++)
      if (!is_same_point(d, means_a[i], means_b[i]))
        return false;
    return true;
  }
  function k_means_pp(d, points, k, range = calc_range(d, points)) {
    const first_mean = points[Math.floor(points.length * Math.random())];
    const pp_means = [first_mean];
    while (pp_means.length < k)
      pp_means.push(new_pp_mean(d, points, pp_means));
    return k_means(d, points, k, range, pp_means);
  }
  function new_pp_mean(d, points, pp_means) {
    const point_squared_distances = points.map((point) => {
      const distances = pp_means.map((mean) => calc_squared_distance(d, mean, point));
      return find_min(distances)[1];
    });
    const total_squared_distance = point_squared_distances.reduce((sum, b) => sum + b, 0);
    const threshold = Math.random() * total_squared_distance;
    let accumulator = 0;
    for (let i = 0; i < points.length; i++) {
      accumulator += point_squared_distances[i];
      if (accumulator >= threshold) {
        return points[i];
      }
    }
    return points.at(-1);
  }
  function k_colors(all_colors, k, range) {
    const d = all_colors[0].length;
    range = range ?? calc_range(d, all_colors);
    const [clusters] = k_means_pp(d, all_colors, k, range);
    for (const c of clusters)
      c.mean = c.mean.map((n) => Math.round(n));
    return clusters;
  }
  self.onmessage = function(event) {
    const req = event.data;
    postMessage({
      id: req.id,
      message: k_colors(req.message.all_colors, req.message.k, req.message.range)
    });
  };
})();
