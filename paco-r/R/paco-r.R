pca <- function(X, pcs) {
  res <- prcomp(X, scale=T, center=T)
  df <- data.frame(res$x[, paste("PC", 1:pcs, sep="")])
  colnames(df) <- paste("paco.PC", 1:pcs, sep="")
  df
}

pacode.kmeans <- function(X, k) {
  X <- scale(X)
  as.vector(kmeans(mtcars, 5)$cluster)
}
